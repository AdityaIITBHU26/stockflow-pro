from fastapi import APIRouter, Depends, Query, HTTPException, Request
from app.api.deps import get_product_service
from app.schemas.common import ResponseModel, PaginatedResponse
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import ProductService
from app.exceptions import StockFlowException, NotFoundException, DuplicateException
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/", response_model=PaginatedResponse)
@limiter.limit("60/minute")
async def list_products(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    category: str = Query(None),
    sort_by: str = Query("id", pattern="^(id|name|price|quantity_in_stock|created_at)$"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    service: ProductService = Depends(get_product_service),
):
    products, total = service.get_products(
        skip=(page-1)*limit,
        limit=limit,
        search=search,
        category=category,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    data = [ProductResponse.model_validate(p).model_dump() for p in products]
    return {
        "success": True,
        "message": "Products retrieved",
        "data": data,
        "page": page,
        "limit": limit,
        "total": total,
    }

@router.post("/", response_model=ResponseModel, status_code=201)
@limiter.limit("30/minute")
async def create_product(
    request: Request,
    product_in: ProductCreate,
    service: ProductService = Depends(get_product_service),
):
    try:
        product = service.create_product(product_in)
        return {
            "success": True,
            "message": "Product created",
            "data": ProductResponse.model_validate(product).model_dump(),
        }
    except DuplicateException as e:
        raise HTTPException(status_code=409, detail=e.message)

@router.get("/{product_id}", response_model=ResponseModel)
async def get_product(
    product_id: int,
    service: ProductService = Depends(get_product_service),
):
    try:
        product = service.get_product(product_id)
        return {
            "success": True,
            "message": "Product retrieved",
            "data": ProductResponse.model_validate(product).model_dump(),
        }
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)

@router.put("/{product_id}", response_model=ResponseModel)
@limiter.limit("30/minute")
async def update_product(
    request: Request,
    product_id: int,
    product_in: ProductUpdate,
    service: ProductService = Depends(get_product_service),
):
    try:
        product = service.update_product(product_id, product_in)
        return {
            "success": True,
            "message": "Product updated",
            "data": ProductResponse.model_validate(product).model_dump(),
        }
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except DuplicateException as e:
        raise HTTPException(status_code=409, detail=e.message)

@router.delete("/{product_id}", response_model=ResponseModel)
@limiter.limit("30/minute")
async def delete_product(
    request: Request,
    product_id: int,
    service: ProductService = Depends(get_product_service),
):
    try:
        service.delete_product(product_id)
        return {
            "success": True,
            "message": "Product deleted",
            "data": None,
        }
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)

import csv
import io
from fastapi import UploadFile, File

@router.post("/import", response_model=ResponseModel)
@limiter.limit("10/minute")
async def import_products(
    request: Request,
    file: UploadFile = File(...),
    service: ProductService = Depends(get_product_service),
):
    try:
        content = await file.read()
        decoded = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))
        required_fields = {"name", "sku", "price", "quantity_in_stock"}
        if not required_fields.issubset(reader.fieldnames or []):
            raise HTTPException(status_code=400, detail=f"CSV must contain columns: {', '.join(required_fields)}")
        
        created = 0
        errors = []
        for row in reader:
            try:
                name = row["name"].strip()
                sku = row["sku"].strip()
                price = float(row["price"])
                quantity = int(row["quantity_in_stock"])
                if price <= 0 or quantity < 0:
                    errors.append(f"Row {reader.line_num}: invalid price or quantity")
                    continue
                description = row.get("description", "").strip()
                category = row.get("category", "").strip()
                product_in = ProductCreate(
                    name=name, sku=sku, description=description,
                    category=category, price=price, quantity_in_stock=quantity
                )
                service.create_product(product_in)
                created += 1
            except DuplicateException:
                errors.append(f"Row {reader.line_num}: SKU '{sku}' already exists")
            except Exception as e:
                errors.append(f"Row {reader.line_num}: {str(e)}")
        
        return {
            "success": True,
            "message": f"Imported {created} products",
            "data": {"created": created, "errors": errors}
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

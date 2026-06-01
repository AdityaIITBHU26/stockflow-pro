from fastapi import APIRouter, Depends, Query, HTTPException, Request
from app.api.deps import get_customer_service
from app.schemas.common import ResponseModel, PaginatedResponse
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer_service import CustomerService
from app.exceptions import NotFoundException, DuplicateException
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/", response_model=PaginatedResponse)
@limiter.limit("60/minute")
async def list_customers(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    sort_by: str = Query("id", pattern="^(id|full_name|email|registration_date)$"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    service: CustomerService = Depends(get_customer_service),
):
    customers, total = service.get_customers(
        skip=(page-1)*limit, limit=limit, search=search,
        sort_by=sort_by, sort_order=sort_order,
    )
    data = [CustomerResponse.model_validate(c).model_dump() for c in customers]
    return {
        "success": True,
        "message": "Customers retrieved",
        "data": data,
        "page": page,
        "limit": limit,
        "total": total,
    }

@router.post("/", response_model=ResponseModel, status_code=201)
@limiter.limit("30/minute")
async def create_customer(
    request: Request,
    customer_in: CustomerCreate,
    service: CustomerService = Depends(get_customer_service),
):
    try:
        customer = service.create_customer(customer_in)
        return {
            "success": True,
            "message": "Customer created",
            "data": CustomerResponse.model_validate(customer).model_dump(),
        }
    except DuplicateException as e:
        raise HTTPException(status_code=409, detail=e.message)

@router.get("/{customer_id}", response_model=ResponseModel)
async def get_customer(
    customer_id: int,
    service: CustomerService = Depends(get_customer_service),
):
    try:
        customer = service.get_customer(customer_id)
        return {
            "success": True,
            "message": "Customer retrieved",
            "data": CustomerResponse.model_validate(customer).model_dump(),
        }
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)

@router.delete("/{customer_id}", response_model=ResponseModel)
@limiter.limit("30/minute")
async def delete_customer(
    request: Request,
    customer_id: int,
    service: CustomerService = Depends(get_customer_service),
):
    try:
        service.delete_customer(customer_id)
        return {
            "success": True,
            "message": "Customer deleted",
            "data": None,
        }
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)

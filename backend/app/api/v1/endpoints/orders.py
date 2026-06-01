from fastapi import APIRouter, Depends, Query, HTTPException, Request
from app.api.deps import get_order_service
from app.schemas.common import ResponseModel, PaginatedResponse
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService
from app.exceptions import NotFoundException, StockFlowException
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/", response_model=PaginatedResponse)
@limiter.limit("60/minute")
async def list_orders(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    search: str = Query(None),
    sort_by: str = Query("id", pattern="^(id|total_amount|created_at)$"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    service: OrderService = Depends(get_order_service),
):
    orders, total = service.get_orders(
        skip=(page-1)*limit, limit=limit, status=status,
        search=search, sort_by=sort_by, sort_order=sort_order,
    )
    data = [OrderResponse.model_validate(o).model_dump() for o in orders]
    return {
        "success": True,
        "message": "Orders retrieved",
        "data": data,
        "page": page,
        "limit": limit,
        "total": total,
    }

@router.post("/", response_model=ResponseModel, status_code=201)
@limiter.limit("30/minute")
async def create_order(
    request: Request,
    order_in: OrderCreate,
    service: OrderService = Depends(get_order_service),
):
    try:
        order = service.create_order(order_in)
        return {
            "success": True,
            "message": "Order created",
            "data": OrderResponse.model_validate(order).model_dump(),
        }
    except StockFlowException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

@router.get("/{order_id}", response_model=ResponseModel)
async def get_order(
    order_id: int,
    service: OrderService = Depends(get_order_service),
):
    try:
        order = service.get_order(order_id)
        return {
            "success": True,
            "message": "Order retrieved",
            "data": OrderResponse.model_validate(order).model_dump(),
        }
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)

@router.delete("/{order_id}", response_model=ResponseModel)
@limiter.limit("30/minute")
async def cancel_order(
    request: Request,
    order_id: int,
    service: OrderService = Depends(get_order_service),
):
    try:
        order = service.cancel_order(order_id)
        return {
            "success": True,
            "message": "Order cancelled",
            "data": OrderResponse.model_validate(order).model_dump(),
        }
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except StockFlowException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

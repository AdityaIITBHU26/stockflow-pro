from fastapi import APIRouter, Depends
from app.api.deps import get_dashboard_service
from app.schemas.common import ResponseModel
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter()

@router.get("/", response_model=ResponseModel)
async def get_dashboard(service: DashboardService = Depends(get_dashboard_service)):
    data = service.get_summary()
    return {
        "success": True,
        "message": "Dashboard data retrieved",
        "data": DashboardResponse(**data).model_dump(),
    }

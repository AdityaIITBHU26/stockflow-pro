from pydantic import BaseModel
from app.models.user import UserRole

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: UserRole = UserRole.WAREHOUSE_STAFF

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole
    is_active: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str

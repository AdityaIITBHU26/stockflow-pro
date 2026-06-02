from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import UserCreate, UserResponse, Token, LoginRequest
from app.services.user_service import UserService
from app.core.security import verify_password, create_access_token, get_current_user
from app.api.deps import get_db
from sqlalchemy.orm import Session
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    if service.get_user_by_username(user_in.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    return service.create_user(user_in)

@router.post("/login", response_model=Token)
def login(login_in: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_in.username).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

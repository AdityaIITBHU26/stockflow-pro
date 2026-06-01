from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "StockFlow Pro"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    FRONTEND_URL: str = "http://localhost:5173"
    SECRET_KEY: str = "change-me"

    class Config:
        env_file = ".env"

settings = Settings()
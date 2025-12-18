from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings managed by Pydantic.
    
    This class defines configuration variables for the application.
    Values are read from environment variables (case-insensitive) or a .env file.
    Default values are provided for development convenience.
    """
    app_name: str = "Issue Tracker API"
    api_v1_prefix: str = "/api/v1"
    # CORS (Cross-Origin Resource Sharing) allowed origins
    # Used to allow the frontend (e.g., Vite dev server) to communicate with this backend
    cors_origins: list[str] = ["http://localhost:5173"]
    secret_key: str = "dev-secret-key"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # Configuration to load from .env file and ignore extra environment variables
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# Instantiate the settings object to be imported by other modules
settings = Settings()

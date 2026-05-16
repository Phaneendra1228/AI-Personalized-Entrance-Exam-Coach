"""
Application configuration using Pydantic Settings.
Reads from .env next to this package so keys load regardless of process cwd.
"""
from pathlib import Path
from typing import List

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent
_DEFAULT_SQLITE = f"sqlite:///{(_BACKEND_DIR / 'learning.db').as_posix()}"

_GEMINI_PLACEHOLDERS = frozenset(("", "your_gemini_api_key_here"))
_OPENAI_PLACEHOLDERS = frozenset(("", "your_openai_api_key_here"))


class Settings(BaseSettings):
    DATABASE_URL: str = _DEFAULT_SQLITE
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "learning-resources"
    LLM_PROVIDER: str = "gemini"  # "gemini" or "openai"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    def valid_gemini_key(self) -> bool:
        k = (self.GEMINI_API_KEY or "").strip()
        return bool(k) and k not in _GEMINI_PLACEHOLDERS

    def valid_openai_key(self) -> bool:
        k = (self.OPENAI_API_KEY or "").strip()
        return bool(k) and k not in _OPENAI_PLACEHOLDERS

    @model_validator(mode="after")
    def resolve_sqlite_relative_to_backend(self) -> "Settings":
        """Keep ./learning.db next to the backend package, not the process cwd."""
        url = self.DATABASE_URL or ""
        if url.startswith("sqlite:///./"):
            relative = url[len("sqlite:///./") :]
            self.DATABASE_URL = f"sqlite:///{(_BACKEND_DIR / relative).as_posix()}"
        return self

    model_config = SettingsConfigDict(
        env_file=_BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# ---------------------------------------------------------------------------
# MYSQL PASSWORD & CONNECTION CONFIGURATION:
#
# Option A (Recommended): In your backend/.env file, change:
#     MYSQL_PASSWORD=your_actual_mysql_password
#
# Option B: Directly in your backend/.env file DATABASE_URL:
#     DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/foodiego_db?charset=utf8mb4
#
# Option C: If not using .env, you can hardcode it directly here:
#     DATABASE_URL = "mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/foodiego_db?charset=utf8mb4"
# ---------------------------------------------------------------------------
DATABASE_URL = settings.get_database_url()

# MySQL / PyMySQL connection arguments
engine_kwargs = {
    "pool_pre_ping": True,
    "pool_recycle": 3600,
}

if "sqlite" not in DATABASE_URL.lower():
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_timeout": 30,
    })

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency injection generator yielding an isolated SQLAlchemy database session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """Check database liveness for health check endpoints."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False

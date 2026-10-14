"""
Database initialization script.
Creates all database tables according to SQLAlchemy ORM models.
"""
import sys
import logging
from app.database.base import Base
from app.database.connection import engine
# Import all models so they register on Base.metadata
import app.models

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def init_db():
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Successfully created all tables in database!")
        for table_name in Base.metadata.tables.keys():
            logger.info(f" - Table verified: {table_name}")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    init_db()

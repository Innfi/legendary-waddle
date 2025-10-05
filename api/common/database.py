from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import structlog
from os import environ

log = structlog.get_logger()

DATABASE_USER = environ.get("DATABASE_USER", "postgres")
DATABASE_PASSWORD = environ.get("DATABASE_PASSWORD", "Str0ngPassword")
DATABASE_URL = environ.get("DATABASE_URL", "127.0.0.1:5432")
DATABASE_OPTION = environ.get("DATABASE_OPTION", "test")
CONN_STRING = "postgresql+psycopg2://{}:{}@{}/{}".format(DATABASE_USER, DATABASE_PASSWORD, DATABASE_URL, DATABASE_OPTION)

log.info("DATABASE_USER", DATABASE_USER=DATABASE_USER)
log.info("DATABASE_PASSWORD", DATABASE_PASSWORD=DATABASE_PASSWORD)
log.info("DATABASE_URL", DATABASE_URL=DATABASE_URL)
log.info("DATABASE_OPTION", DATABASE_OPTION=DATABASE_OPTION)

engine = create_engine(CONN_STRING, echo=True, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


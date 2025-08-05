from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from os import environ

DATABASE_USER = environ.get("DATABASE_USER", "pgdev")
DATABASE_PASSWORD = environ.get("DATABASE_PASSWORD", "local_password")
DATABASE_URL = environ.get("DATABASE_URL", "localhost:5432")
DATABASE_OPTION = environ.get("DATABASE_OPTION", "test")
CONN_STRING = "postgresql+psycopg2://{}:{}@{}/{}".format(DATABASE_USER, DATABASE_PASSWORD, DATABASE_URL, DATABASE_OPTION)

engine = create_engine(CONN_STRING, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    print(f"connstring: {CONN_STRING}")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from sqlalchemy import create_engine, Column, Integer, String, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./zksentinel.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id = Column(String, primary_key=True, index=True) # UUID
    created_at = Column(DateTime, default=datetime.utcnow)
    file_hash = Column(String)
    credit_score = Column(Integer)
    risk_level = Column(String)
    reasoning = Column(String)
    proof_status = Column(String, default="pending") # pending, generated, failed
    proof_data = Column(JSON, nullable=True) # Store the proof here once generated

def init_db():
    Base.metadata.create_all(bind=engine)
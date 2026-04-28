from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from datetime import datetime
from .database import Base

class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default="draft") # draft, pending, approved, deploying, success, failed, rolling_back
    risk_score = Column(Float, default=0.0)
    change_type = Column(String) # infra, app, db, emergency
    environment = Column(String) # dev, staging, prod
    created_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    payload = Column(JSON) # Terraform vars or K8s manifest snippets
    audit_log = Column(JSON, default=[])

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    change_id = Column(Integer)
    action = Column(String)
    actor = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON)

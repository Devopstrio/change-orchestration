from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any

class Login(BaseModel):
    username: str
    password: str

class ChangeBase(BaseModel):
    title: str
    description: str
    change_type: str
    environment: str
    payload: Optional[Dict[str, Any]] = None

class ChangeCreate(ChangeBase):
    pass

class ChangeRequest(ChangeBase):
    id: int
    status: str
    risk_score: float
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

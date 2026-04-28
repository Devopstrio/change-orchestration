import logging
import time
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
from pythonjsonlogger import jsonlogger
from . import models, schemas
from .database import engine, SessionLocal
from sqlalchemy.orm import Session

# Database initialization
models.Base.metadata.create_all(bind=engine)

# Logger setup
logger = logging.getLogger("change-orchestration")
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

app = FastAPI(title="Change Orchestration API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(
        f"Request: {request.method} {request.url.path} Status: {response.status_code} Duration: {duration:.4f}s"
    )
    return response

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/auth/login")
def login(form_data: schemas.Login):
    # Dummy login
    return {"access_token": "dummy_token", "token_type": "bearer"}

@app.get("/changes", response_model=list[schemas.ChangeRequest])
def get_changes(db: Session = Depends(get_db)):
    return db.query(models.ChangeRequest).all()

@app.post("/changes", response_model=schemas.ChangeRequest)
def create_change(change: schemas.ChangeCreate, db: Session = Depends(get_db)):
    db_change = models.ChangeRequest(**change.dict())
    db.add(db_change)
    db.commit()
    db.refresh(db_change)
    return db_change

@app.post("/changes/{id}/approve")
def approve_change(id: int, db: Session = Depends(get_db)):
    change = db.query(models.ChangeRequest).filter(models.ChangeRequest.id == id).first()
    if not change:
        raise HTTPException(status_code=404, detail="Change not found")
    change.status = "approved"
    db.commit()
    return {"status": "approved"}

@app.post("/changes/{id}/deploy")
def deploy_change(id: int, db: Session = Depends(get_db)):
    change = db.query(models.ChangeRequest).filter(models.ChangeRequest.id == id).first()
    if not change:
        raise HTTPException(status_code=404, detail="Change not found")
    change.status = "deploying"
    db.commit()
    # Trigger async orchestration logic here
    return {"status": "deploying"}

@app.post("/changes/{id}/rollback")
def rollback_change(id: int, db: Session = Depends(get_db)):
    change = db.query(models.ChangeRequest).filter(models.ChangeRequest.id == id).first()
    if not change:
        raise HTTPException(status_code=404, detail="Change not found")
    change.status = "rolling_back"
    db.commit()
    return {"status": "rolling_back"}

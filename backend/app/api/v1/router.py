from fastapi import APIRouter
from app.api.v1.endpoints import auth, cases, interactions, triage, break_glass, relief, audit, analytics, health

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(cases.router)
api_router.include_router(interactions.router)
api_router.include_router(triage.router)
api_router.include_router(break_glass.router)
api_router.include_router(relief.router)
api_router.include_router(audit.router)
api_router.include_router(analytics.router)
api_router.include_router(health.router)

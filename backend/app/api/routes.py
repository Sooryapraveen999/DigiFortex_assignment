from fastapi import APIRouter, HTTPException
from typing import List
import logging

from app.models.schemas import BrandScanRequest, BrandScanResponse, DashboardSummary, ScanHistoryItem
from app.services.monitoring_service import run_brand_scan
from app.database.db import get_scan_summary, list_scan_results

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/scan", response_model=BrandScanResponse)
def scan_brand(payload: BrandScanRequest) -> BrandScanResponse:
    try:
        return run_brand_scan(payload)
    except ValueError as exc:
        logger.error(f"Validation error in scan: {exc}")
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ConnectionError as exc:
        logger.error(f"Connection error during scan: {exc}")
        raise HTTPException(status_code=503, detail="External service unavailable. Please try again later.") from exc
    except Exception as exc:
        logger.error(f"Unexpected error during scan: {exc}")
        raise HTTPException(status_code=502, detail="Scan failed due to integration error. Please try again.") from exc


@router.get("/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary() -> DashboardSummary:
    try:
        return DashboardSummary(**get_scan_summary())
    except Exception as exc:
        logger.error(f"Error fetching dashboard summary: {exc}")
        return DashboardSummary(total_scans=0, total_findings=0, total_high_risk=0)


@router.get("/dashboard/recent", response_model=List[ScanHistoryItem])
def dashboard_recent(limit: int = 10) -> List[ScanHistoryItem]:
    try:
        items = list_scan_results(limit=limit)
        return [ScanHistoryItem(**item) for item in items]
    except Exception as exc:
        logger.error(f"Error fetching recent scans: {exc}")
        return []

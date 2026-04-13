import json
import os
from datetime import datetime
from typing import Any, Dict, List

from sqlalchemy import DateTime, Integer, String, Text, create_engine, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Base(DeclarativeBase):
    pass


class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    total_findings: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    high_risk_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, index=True)


def _database_url() -> str:
    return os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/brand_monitoring",
    )


engine = create_engine(_database_url(), pool_pre_ping=True)


def init_db() -> None:
    Base.metadata.create_all(engine)


def save_scan_result(result: Dict[str, Any]) -> Dict[str, Any]:
    with Session(engine) as session:
        row = ScanResult(
            company_name=result["company_name"],
            total_findings=result["total_findings"],
            high_risk_count=result["high_risk_count"],
            payload_json=json.dumps(result),
        )
        session.add(row)
        session.commit()
    return result


def list_scan_results(limit: int = 20) -> List[Dict[str, Any]]:
    with Session(engine) as session:
        rows = session.scalars(select(ScanResult).order_by(ScanResult.created_at.desc()).limit(limit)).all()
        return [
            {
                "id": row.id,
                "company_name": row.company_name,
                "total_findings": row.total_findings,
                "high_risk_count": row.high_risk_count,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]


def get_scan_summary() -> Dict[str, int]:
    with Session(engine) as session:
        total_scans = session.scalar(select(func.count()).select_from(ScanResult)) or 0
        total_findings = session.scalar(select(func.coalesce(func.sum(ScanResult.total_findings), 0))) or 0
        total_high_risk = session.scalar(select(func.coalesce(func.sum(ScanResult.high_risk_count), 0))) or 0
    return {
        "total_scans": int(total_scans),
        "total_findings": int(total_findings),
        "total_high_risk": int(total_high_risk),
    }

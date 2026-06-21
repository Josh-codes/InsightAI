import time
import decimal
import datetime
from django.conf import settings
from sqlalchemy import text
from utils.db_connection import get_engine


def execute_query(sql: str) -> tuple[list[dict], int]:
    """Execute validated SQL and return (rows, elapsed_ms)."""
    engine = get_engine()
    start = time.monotonic()

    with engine.connect() as conn:
        timeout_ms = settings.QUERY_TIMEOUT_SECONDS * 1000
        conn.execute(text(f"SET statement_timeout = '{timeout_ms}'"))
        result = conn.execute(text(sql))
        rows = result.fetchmany(settings.MAX_QUERY_RESULT_ROWS)
        columns = list(result.keys())

    elapsed_ms = int((time.monotonic() - start) * 1000)
    data = [dict(zip(columns, row)) for row in rows]
    return _serialize_rows(data), elapsed_ms


def _serialize_rows(rows: list[dict]) -> list[dict]:
    result = []
    for row in rows:
        new_row = {}
        for k, v in row.items():
            if isinstance(v, decimal.Decimal):
                new_row[k] = float(v)
            elif isinstance(v, (datetime.date, datetime.datetime)):
                new_row[k] = v.isoformat()
            elif v is None:
                new_row[k] = None
            else:
                new_row[k] = v
        result.append(new_row)
    return result

import re
import pandas as pd
from sqlalchemy import text
from utils.db_connection import get_engine

SAFE_IDENTIFIER_RE = re.compile(r'^[a-z0-9_]+$')
ALLOWED_TYPES = {'TEXT', 'BIGINT', 'INTEGER', 'DOUBLE PRECISION', 'REAL', 'BOOLEAN', 'TIMESTAMP'}


def _assert_safe(identifier: str, label: str) -> None:
    if not SAFE_IDENTIFIER_RE.match(identifier):
        raise ValueError(f'Unsafe {label}: {identifier!r}')


def create_dataset_table(table_name: str, schema: dict[str, str]) -> None:
    _assert_safe(table_name, 'table name')
    col_defs = []
    for col, pg_type in schema.items():
        _assert_safe(col, 'column name')
        if pg_type not in ALLOWED_TYPES:
            raise ValueError(f'Disallowed column type: {pg_type!r}')
        col_defs.append(f'"{col}" {pg_type}')

    ddl = f'CREATE TABLE IF NOT EXISTS "{table_name}" (id SERIAL PRIMARY KEY, {", ".join(col_defs)})'
    engine = get_engine()
    with engine.connect() as conn:
        conn.execute(text(ddl))
        conn.commit()


def insert_dataframe(table_name: str, df: pd.DataFrame) -> None:
    _assert_safe(table_name, 'table name')
    engine = get_engine()
    df.to_sql(table_name, engine, if_exists='append', index=False, chunksize=500)


def drop_dataset_table(table_name: str) -> None:
    if not table_name:
        return
    _assert_safe(table_name, 'table name')
    engine = get_engine()
    with engine.connect() as conn:
        conn.execute(text(f'DROP TABLE IF EXISTS "{table_name}"'))
        conn.commit()

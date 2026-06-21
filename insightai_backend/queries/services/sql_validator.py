import re
import sqlparse
from sqlparse.tokens import Keyword, DDL, DML

BLOCKED_KEYWORDS = {
    'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE',
    'TRUNCATE', 'REPLACE', 'MERGE', 'GRANT', 'REVOKE',
    'EXEC', 'EXECUTE', 'CALL', 'SET', 'COPY', 'ATTACH',
}


def validate_sql(sql: str, dataset) -> str:
    """
    Two-pass validation: sqlparse token scan + regex.
    Then verifies table name and column names against stored schema.
    Returns cleaned SQL or raises ValueError.
    """
    sql = sql.strip().rstrip(';')

    # Pass 1 — sqlparse structural check
    parsed = sqlparse.parse(sql)
    if not parsed or len(parsed) != 1:
        raise ValueError('Expected exactly one SQL statement.')

    stmt = parsed[0]
    if stmt.get_type() != 'SELECT':
        raise ValueError('Only SELECT statements are permitted.')

    for token in stmt.flatten():
        if token.ttype in (Keyword, DDL, DML):
            val = token.normalized.upper()
            if val in BLOCKED_KEYWORDS:
                raise ValueError(f'Forbidden SQL keyword: {val}')

    # Pass 2 — regex word-boundary scan on uppercased SQL
    sql_upper = sql.upper()
    for blocked in BLOCKED_KEYWORDS:
        if re.search(rf'\b{re.escape(blocked)}\b', sql_upper):
            raise ValueError(f'Forbidden SQL keyword: {blocked}')

    # Pass 3 — table name must reference the dataset's table
    if dataset.table_name.lower() not in sql.lower():
        raise ValueError('SQL references an unauthorized table.')

    # Pass 4 — all quoted identifiers must exist in schema or match table name
    schema_cols = set(dataset.schema.keys())
    quoted_ids = re.findall(r'"([^"]+)"', sql)
    for identifier in quoted_ids:
        if identifier == dataset.table_name:
            continue
        if identifier not in schema_cols:
            raise ValueError(f'Column or table "{identifier}" does not exist in this dataset.')

    return sql

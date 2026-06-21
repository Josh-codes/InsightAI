import pandas as pd

PANDAS_TO_PG: dict[str, str] = {
    'int64': 'BIGINT',
    'int32': 'INTEGER',
    'int16': 'INTEGER',
    'int8': 'INTEGER',
    'float64': 'DOUBLE PRECISION',
    'float32': 'REAL',
    'bool': 'BOOLEAN',
    'datetime64[ns]': 'TIMESTAMP',
    'object': 'TEXT',
}


def infer_column_types(df: pd.DataFrame) -> dict[str, str]:
    result = {}
    for col in df.columns:
        dtype = str(df[col].dtype)
        if dtype == 'object':
            sample = df[col].dropna().head(100)
            if len(sample) > 0:
                try:
                    pd.to_datetime(sample, infer_datetime_format=True)
                    result[col] = 'TIMESTAMP'
                except Exception:
                    result[col] = 'TEXT'
            else:
                result[col] = 'TEXT'
        else:
            result[col] = PANDAS_TO_PG.get(dtype, 'TEXT')
    return result

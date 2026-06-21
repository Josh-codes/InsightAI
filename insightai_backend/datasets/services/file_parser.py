import re
import pandas as pd

MAX_FILE_SIZE = 52428800  # 50MB
MAX_COLUMNS = 200


def sanitize_column_name(name: str) -> str:
    cleaned = re.sub(r'[^a-z0-9_]', '_', str(name).lower().strip())
    cleaned = re.sub(r'_+', '_', cleaned).strip('_')
    return cleaned[:63] or f'col_{abs(hash(name)) % 10000}'


def parse_uploaded_file(file_obj) -> pd.DataFrame:
    filename = file_obj.name.lower()
    size = file_obj.size

    if size > MAX_FILE_SIZE:
        raise ValueError(f'File too large ({size // 1024 // 1024}MB). Maximum is 50MB.')

    if filename.endswith('.csv'):
        df = pd.read_csv(file_obj, low_memory=False)
    elif filename.endswith('.xlsx'):
        df = pd.read_excel(file_obj, engine='openpyxl')
    elif filename.endswith('.xls'):
        df = pd.read_excel(file_obj, engine='xlrd')
    else:
        raise ValueError('Unsupported file type. Please upload a CSV or Excel (.xlsx/.xls) file.')

    if df.empty:
        raise ValueError('The uploaded file contains no data rows.')
    if len(df.columns) > MAX_COLUMNS:
        raise ValueError(f'Too many columns ({len(df.columns)}). Maximum is {MAX_COLUMNS}.')

    # Sanitize column names
    sanitized = [sanitize_column_name(c) for c in df.columns]

    # Deduplicate
    seen: dict[str, int] = {}
    unique_cols = []
    for col in sanitized:
        if col in seen:
            seen[col] += 1
            unique_cols.append(f'{col}_{seen[col]}')
        else:
            seen[col] = 0
            unique_cols.append(col)

    df.columns = unique_cols
    return df

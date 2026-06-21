import pandas as pd


def calculate_stats(df: pd.DataFrame) -> dict:
    stats = {}
    for col in df.columns:
        col_stats: dict = {'null_count': int(df[col].isna().sum())}
        if pd.api.types.is_numeric_dtype(df[col]) and not df[col].isna().all():
            col_stats['min'] = float(df[col].min())
            col_stats['max'] = float(df[col].max())
            col_stats['mean'] = round(float(df[col].mean()), 4)
        elif pd.api.types.is_object_dtype(df[col]):
            top = df[col].value_counts().head(5)
            col_stats['top_values'] = top.index.tolist()
            col_stats['unique_count'] = int(df[col].nunique())
        stats[col] = col_stats
    return stats


def get_preview_rows(df: pd.DataFrame, n: int = 5) -> list:
    return df.head(n).fillna('').astype(str).to_dict('records')

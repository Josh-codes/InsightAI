DATETIME_PG_TYPES = {'TIMESTAMP', 'DATE', 'TIME'}


def detect_chart_type(data: list[dict], schema: dict) -> str:
    if not data:
        return 'table'

    cols = list(data[0].keys())

    # Line chart: any column type is a datetime
    for col in cols:
        if schema.get(col, '').upper() in DATETIME_PG_TYPES:
            return 'line'

    # Bar chart: <30 rows, 2 columns, second column ≥80% numeric
    if len(data) < 30 and len(cols) == 2:
        second_col = cols[1]
        numeric_count = sum(
            1 for row in data if isinstance(row.get(second_col), (int, float))
        )
        if numeric_count / len(data) >= 0.8:
            return 'bar'

    return 'table'

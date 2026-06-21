def build_schema_context(dataset) -> str:
    lines = [f'Table: {dataset.table_name}', 'Columns:']
    for col, pg_type in dataset.schema.items():
        lines.append(f'  - {col} ({pg_type})')

    if dataset.preview_data:
        lines.append('\nSample rows (first 3):')
        for row in dataset.preview_data[:3]:
            lines.append(f'  {row}')

    return '\n'.join(lines)

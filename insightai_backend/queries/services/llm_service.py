import hashlib
from django.conf import settings
from django.core.cache import cache
from openai import OpenAI

from .schema_builder import build_schema_context

_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


SYSTEM_PROMPT = """You are a PostgreSQL expert. Given a table schema and a user question, write a single valid PostgreSQL SELECT query.

Rules:
- Write ONLY a SELECT statement. Never use INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, CREATE, or any DDL/DML.
- Always use double-quotes around column and table names.
- Include LIMIT {row_limit} unless the user explicitly asks for all rows.
- Return ONLY the raw SQL query — no explanation, no markdown code fences, no comments.
- If the question cannot be answered with the available schema, return exactly: CANNOT_ANSWER
"""


def _cache_key(natural_language: str, dataset_id: int) -> str:
    h = hashlib.sha256(f'{dataset_id}:{natural_language.lower().strip()}'.encode()).hexdigest()
    return f'query_cache:{h}'


def generate_sql(natural_language: str, dataset) -> tuple[str, bool]:
    """Returns (raw_llm_output, from_cache)."""
    key = _cache_key(natural_language, dataset.id)
    cached = cache.get(key)
    if cached:
        return cached, True

    schema_context = build_schema_context(dataset)
    system = SYSTEM_PROMPT.format(row_limit=settings.MAX_QUERY_RESULT_ROWS)

    client = _get_client()
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {'role': 'system', 'content': system},
            {'role': 'user', 'content': f'Schema:\n{schema_context}\n\nQuestion: {natural_language}'},
        ],
        temperature=0,
        max_tokens=500,
        timeout=15,
    )

    result = response.choices[0].message.content.strip()
    cache.set(key, result, timeout=86400)  # 24h
    return result, False

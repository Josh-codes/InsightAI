from django.conf import settings
from openai import OpenAI

_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


def generate_insight(natural_language: str, sql: str, data: list[dict]) -> str:
    if not data:
        return 'The query returned no results.'

    summary = f'Query returned {len(data)} rows. First 5 rows: {data[:5]}'

    client = _get_client()
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                'role': 'system',
                'content': (
                    'You are a business analyst. Based on SQL query results, '
                    'write 2-3 sentences of actionable business insight. '
                    'Be specific, reference actual numbers from the data.'
                ),
            },
            {
                'role': 'user',
                'content': f'Question: {natural_language}\nSQL: {sql}\nData: {summary}',
            },
        ],
        temperature=0.3,
        max_tokens=200,
        timeout=10,
    )
    return response.choices[0].message.content.strip()

import re


def extract_sql(llm_response: str) -> str:
    text = llm_response.strip()

    if text == 'CANNOT_ANSWER':
        raise ValueError('This question cannot be answered with the available data.')

    # Strip markdown code fences: ```sql ... ``` or ``` ... ```
    fence_match = re.search(r'```(?:sql)?\s*([\s\S]+?)\s*```', text, re.IGNORECASE)
    if fence_match:
        return fence_match.group(1).strip()

    return text

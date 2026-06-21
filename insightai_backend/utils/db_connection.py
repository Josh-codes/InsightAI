import os
from sqlalchemy import create_engine

_engine = None


def get_engine():
    global _engine
    if _engine is None:
        db_url = os.getenv('DATABASE_URL', '')
        # SQLAlchemy requires postgresql+psycopg2:// scheme
        db_url = db_url.replace('postgres://', 'postgresql+psycopg2://', 1)
        if not db_url.startswith('postgresql'):
            db_url = 'postgresql+psycopg2://insightai_user:password@localhost:5432/insightai_dev'
        _engine = create_engine(db_url, pool_pre_ping=True, pool_size=5, max_overflow=10)
    return _engine

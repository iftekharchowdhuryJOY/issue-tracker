import redis.asyncio as redis
from app.core.config import settings

# Global variable to hold the pool, but initialized lazily
_redis_pool = None

def get_redis_client():
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = redis.ConnectionPool.from_url(settings.redis_url, decode_responses=True)
    return redis.Redis(connection_pool=_redis_pool)

async def set_cache(key: str, value: str, expire: int = settings.cache_ttl_seconds):
    """Set a value in Redis with an optional expiration."""
    client = get_redis_client()
    await client.set(key, value, ex=expire)

async def get_cache(key: str) -> str | None:
    """Get a value from Redis."""
    client = get_redis_client()
    return await client.get(key)

async def delete_cache(key: str):
    """Delete a value from Redis."""
    client = get_redis_client()
    await client.delete(key)

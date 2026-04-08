import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = createClient({
    url: redisUrl,
    socket: process.env.NODE_ENV === 'production' ? {
        tls: true,
        rejectUnauthorized: false
    } : {}
});

redis.on('error', (err) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis Client Connected'));

(async () => {
    try {
        if (!redis.isOpen) {
            await redis.connect();
        }
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

export default redis;
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Check if URL uses rediss:// protocol for TLS
const usesTLS = redisUrl.startsWith('rediss://');

const redis = createClient({
    url: redisUrl,
    socket: usesTLS ? {
        tls: true,
        rejectUnauthorized: false
    } : undefined
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
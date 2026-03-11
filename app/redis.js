import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: 6379,
    keyPrefix: "url-shortener:",
    db: 0
});

export default redis;
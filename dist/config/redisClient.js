"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Set up the Redis client
const redisClient = new ioredis_1.default({
    // Use Upstash's REST URL if using Upstash with REST API
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.UPSTASH_REDIS_REST_TOKEN, // Use token for authentication
    // Optional: For handling automatic retries, you can increase the retry logic
    maxRetriesPerRequest: 10, // Set a max retry limit to 10
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000); // Gradually increase delay up to 2 seconds
        console.log(`Reconnecting to Redis in ${delay} ms`);
        return delay; // Return the retry delay in ms
    },
    // Optional: Set connection timeout for faster failure detection
    connectTimeout: 10000, // 10 seconds timeout
    reconnectOnError: (err) => {
        console.error('Redis reconnect error:', err);
        return true; // Reconnect on error
    },
    // Enable TLS if necessary, check with Upstash documentation
    tls: {} // Uncomment if using secure connection (check with Upstash)
});
// Event listeners for Redis
redisClient.once('connect', () => console.log('Successfully connected to Redis'));
redisClient.on('ready', () => console.log('Redis client is ready'));
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('reconnecting', (delay) => console.log(`Reconnecting to Redis in ${delay} ms`));
redisClient.on('end', () => console.log('Redis connection closed'));
// Export the Redis client
exports.default = redisClient;

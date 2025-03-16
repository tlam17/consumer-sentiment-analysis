const { createClient} = require("redis");

// Create Redis client with connection options
const redisClient = createClient({
    url: "redis://localhost:6379"
});

// Handle connection events
redisClient.on("error", (err) => {
    console.log("Redis connection error:", err);
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

// Connect to Redis
await redisClient.connect();

module.exports = redisClient;
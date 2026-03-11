import Redis from "ioredis";

const redis = new Redis({
    port: 6379,
   keyPrefix: "url-shortener:" 
});

export default redis;
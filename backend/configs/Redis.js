const redis = require("redis");

class RedisCache {
  init = () => {
    this.cache = redis.createClient(process.env.REDIS_PORT);
    this.cache.on("ready", (err) => {
      console.log("CACHE READY", err ? err : "no errors");
    });
    this.cache.on("error", (e) => {
      throw e;
      console.log("Cache failed", e);
    });
  };
}
module.exports = new RedisCache();

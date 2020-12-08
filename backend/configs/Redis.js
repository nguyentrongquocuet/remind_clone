const redis = require("redis");
const { promisify } = require("util");
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
    this.getAsync = promisify(this.cache.get).bind(this.cache);
    this.setAsync = promisify(this.cache.set).bind(this.cache);
  };
}
module.exports = new RedisCache();

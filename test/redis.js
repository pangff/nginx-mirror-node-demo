const Redis = require("ioredis");
const md5 = require("md5")
const config = require('config')
let redis ;

if(!process.env.NODE_ENV || process.env.NODE_ENV == "default"){
     redis = new Redis(config.get("Redis"));
}else{
    redis = new Redis.Cluster(config.get("Redis-Cluster.cluster"),config.get("Redis-Cluster.redisOptions"))
}

(async()=>{
  let result =  await redis.get("test")
  console.log(result,"result")
  await redis.set("test","123456");
  result =  await redis.get("test")
  console.log(result,"result")
})();

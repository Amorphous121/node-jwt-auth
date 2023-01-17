const redis = require('redis');

const client = redis.createClient();

client.connect();

client.on('connect', () => {
    console.log("🔥 Redis is connected.");
});

client.on('ready', ()=> {
    console.log("😊 Redis client is connected and ready to use now.");
})

client.on('error', (err) => {
    console.log("🥲 Error in redis connection.");
})

client.on('end', () => {
    console.log("😭 Redis connection is disconnected!");
})

client.on('SIGINT', ()=> {
    client.quit();
})

module.exports = client;
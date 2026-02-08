require('dotenv').config();
const { ClusterManager , HeartbeatManager } = require('discord-hybrid-sharding');
config = require('./config.json')
const manager = new ClusterManager(`${__dirname}/index.js`, {
    totalShards: 2,
    shardsPerClusters: 2,
     totalClusters: 1,
    mode: 'process', 
    token: process.env.DISCORD_BOT_TOKEN,
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });
manager.extend(
    new HeartbeatManager({
        interval: 2000,
        maxMissedHeartbeats: 5, 
    })
)


const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    client.on('ready', async () => {
        console.log(`${client.user.id} is ready.`);
        client.logger.log(`Logged in to ${client.user.tag}`, 'ready');

        let developerUser = null;
        try {
            developerUser = await client.users.fetch('1043752570243526757');
        } catch (err) {
            developerUser = null;
        }

        const developerName = developerUser?.displayName || 'Developer';

        let currentIndex = 0;

        const getPresenceList = () => {
            const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0) || 0;

            return [
                {
                    activities: [{
                        name: "7xLuxor",
                        type: ActivityType.Streaming,
                        url: 'https://twitch.tv/discord'
                    }],
                    status: 'idle'
                },
                {
                    activities: [{
                        name: 'in your server',
                        type: ActivityType.Playing
                    }],
                    status: 'dnd'
                },
                {
                    activities: [{
                        name: "to your fav playlist",
                        type: ActivityType.Listening
                    }],
                    status: 'idle'
                },
                {
                    activities: [{
                        name: 'your Mom',
                        type: ActivityType.Watching
                    }],
                    status: 'dnd'
                },
        };

        const updatePresence = () => {
            const presenceList = getPresenceList();
            const presence = presenceList[currentIndex];

            client.user.setPresence(presence);

            currentIndex++;
            if (currentIndex >= presenceList.length) {
                currentIndex = 0;
            }
        };

        updatePresence();

        setInterval(updatePresence, 3000);
    });
};

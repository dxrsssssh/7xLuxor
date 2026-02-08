module.exports = async (client) => {
    const LEVIATHAN_EMOJI = '<:leviathan:1443948393822162964>';
    const keywords = ['leviathan', 'Rudra', 'Rudra'];

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        try {
            const messageText = message.content.toLowerCase();

            if (keywords.some(keyword => messageText.includes(keyword))) {
                await message.react('1443948393822162964');
            }

            if (message.mentions.has(client.user.id)) {
                const isMentioningDeveloper = message.mentions.has('354455090888835073');
                if (isMentioningDeveloper) {
                    await message.react('1443948393822162964');
                }
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    });
};

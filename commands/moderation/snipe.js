const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const axios = require('axios');

module.exports = {
    name: 'snipe',
    aliases: [],
    category: 'info',
    usage: 'snipe',
    premium: true,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.channel.send({
                embeds: [
                    client.util.embed()
                        .setColor(client.color)
                        .setDescription(`You must have \`Manage Messages\` permissions to run this command.`)
                ]
            });
        }

        const getSnipe = client.snipe.prepare('SELECT * FROM snipes WHERE guildId = ? AND channelId = ?');
        const snipe = getSnipe.get(message.guild.id, message.channel.id);

        if (!snipe) {
            return message.channel.send({
                embeds: [
                    client.util.embed()
                        .setColor(client.color)
                        .setDescription(`There are no deleted messages to snipe in this channel.`)
                ]
            });
        }

        try {
            const canvas = Canvas.createCanvas(1200, 400);
            const ctx = canvas.getContext('2d');

            const gradient = ctx.createLinearGradient(0, 0, 1200, 400);
            gradient.addColorStop(0, '#001F3F');
            gradient.addColorStop(0.5, '#41729F');
            gradient.addColorStop(1, '#E1F1FF');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1200, 400);

            if (snipe.pfp) {
                try {
                    const response = await axios.get(snipe.pfp, { responseType: 'arraybuffer', timeout: 5000 });
                    const pfpImage = await Canvas.loadImage(Buffer.from(response.data));
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(70, 70, 55, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(pfpImage, 15, 15, 110, 110);
                    ctx.restore();
                } catch (err) {
                    console.error('Error loading PFP:', err);
                }
            }

            const displayName = snipe.displayName || snipe.userName || 'Unknown';
            const userName = snipe.userName || 'unknown';
            const content = snipe.content || 'No content';

            ctx.font = 'bold 36px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(displayName.substring(0, 30), 140, 70);

            ctx.font = '20px Arial';
            ctx.fillStyle = '#E0E0E0';
            ctx.fillText(`@${userName.substring(0, 20)}`, 140, 100);

            ctx.font = '16px Arial';
            ctx.fillStyle = '#D0D0D0';
            const date = snipe.timestamp ? new Date(snipe.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Unknown';
            ctx.fillText(date.substring(0, 40), 140, 125);

            const messageText = content.substring(0, 100);
            ctx.font = '22px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(messageText, 140, 160);

            let indicatorX = 140;
            if (snipe.hasEmoji) {
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = '#FFD700';
                ctx.fillText('Emoji', indicatorX, 350);
                indicatorX += 150;
            }

            if (snipe.isGif) {
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = '#FF1493';
                ctx.fillText('GIF', indicatorX, 350);
            }

            const buffer = canvas.toBuffer('image/png');
            const attachment = new AttachmentBuilder(buffer, { name: 'sniped-message.png' });

            // Build detailed fields
            const fields = [];
            
            // Field 1: Author Info (with reply1 emoji)
            fields.push({
                name: `${client.emoji.reply1} Author Information`,
                value: `**Username:** ${snipe.userName}\n**Tag:** ${snipe.userTag}\n**User ID:** ${snipe.userId}`,
                inline: false
            });

            // Field 2: Message Details (with reply2 emoji)
            fields.push({
                name: `${client.emoji.reply2} Message Details`,
                value: `**Content Length:** ${content.length} characters\n**Timestamp:** ${snipe.timestamp ? new Date(snipe.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Unknown'}\n**Contains Emoji:** ${snipe.hasEmoji ? 'Yes' : 'No'}`,
                inline: false
            });

            // Field 3: Full Message Content (with reply2 emoji)
            fields.push({
                name: `${client.emoji.reply2} Message Content`,
                value: `\`\`\`${content.substring(0, 300)}\`\`\`${content.length > 300 ? '\n*Content truncated...*' : ''}`,
                inline: false
            });

            // Field 4: Attachments & Media (with reply2 emoji if not last)
            if (snipe.imageUrl || snipe.isGif) {
                fields.push({
                    name: `${client.emoji.reply2} Attachments`,
                    value: `**Type:** ${snipe.isGif ? 'GIF' : 'Image'}\n**Link:** [View Media](${snipe.imageUrl})`,
                    inline: false
                });
            }

            // Use reply3 emoji for the last field
            if (fields.length > 0) {
                const lastField = fields[fields.length - 1];
                lastField.name = lastField.name.replace(client.emoji.reply2, client.emoji.reply3);
            }

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle(' Sniped Message Details')
                .setImage('attachment://sniped-message.png')
                .addFields(...fields)
                .setFooter({ text: `Sniped by ${message.author.username} • Channel: #${message.channel.name}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.channel.send({ embeds: [embed], files: [attachment] });

        } catch (err) {
            console.error('Error in snipe command:', err);
            return message.channel.send({
                embeds: [
                    client.util.embed()
                        .setColor('#FF0000')
                        .setDescription(`Error processing snipe.`)
                ]
            });
        }
    },
};

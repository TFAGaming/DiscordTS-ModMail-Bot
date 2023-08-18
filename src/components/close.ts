import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import { client as defaultClient } from '../index';
import { ComponentType } from 'horizon-handler';
import config from '../config';

export default new defaultClient.handler.components.component({
    type: ComponentType.Button,
    customId: 'close',
    run: async (client, interaction) => {

        const guild = client.guilds.cache.get(config.modmail.guildId);

        if (!guild) return;

        const category = guild.channels.cache.find((v) => v.id === config.modmail.categoryId || v.name === 'ModMail');

        if (!category || !interaction.channel || interaction.channel.type !== 0) return;

        if (interaction.channel.parentId !== category.id) return;

        await interaction.reply({
            content: 'Please wait...',
            ephemeral: true
        });

        const transcriptMessages = [];

        const messages = await interaction.channel.messages.fetch();

        for (const message of messages.values()) {
            if (message.embeds && message.author.id === client.user?.id) {
                transcriptMessages.push(`[${new Date(message.createdTimestamp).toLocaleString()}] ${message.embeds[0]?.author?.name}: ${(message.embeds[0]?.description || message.embeds[0]?.image?.proxyURL || '[Error: Unable to fetch message content]')} ${message.attachments?.size > 0 ? message.attachments.map((v) => v.proxyURL).join(' ') : ''}`);
            } else if ((message.content || message.attachments?.size) && message.author.bot === false) {
                transcriptMessages.push(`[${new Date(message.createdTimestamp).toLocaleString()}] ${message.author.displayName}: ${message.content} ${message.attachments?.size > 0 ? message.attachments.map((v) => v.proxyURL).join(' ') : ''}`);
            } else continue;
        };

        transcriptMessages.reverse();

        // This will remove the first messages when the mail is created. Do not touch this to avoid errors.
        transcriptMessages.shift();
        transcriptMessages.shift();

        const data = defaultClient.db.mails.findOne((v) => v.channelId === interaction.channelId);

        await interaction.channel.delete();

        const user = client.users.cache.get(data?.userId as string);

        if (!user) return;

        await user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Your mail has been closed.')
                    .setDescription(`**${interaction.user.displayName}** has closed your mail since it's marked as completed. Thank you for using our support!`)
                    .setFooter({
                        text: `${interaction.guild?.name} devs`
                    })
            ]
        }).catch(null);

        await user.send({
            content: 'Mail messages history:',
            files: [
                new AttachmentBuilder(
                    Buffer.from(transcriptMessages.join('\n'), 'utf-8'), { name: 'history.txt' }
                )
            ]
        }).catch(null);

    }
});
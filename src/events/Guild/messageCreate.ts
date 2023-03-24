import { ChannelType, EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../..";
import { createDiscordTimestamp, errorEmbed, successEmbed } from "../../util/functions";

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.guild) {
        const guild = client.guilds.cache.get(client.main_db.get('guild'));

        if (!guild) return;

        const category = guild.channels.cache.get(client.main_db.get('category'));

        if (!category) return;

        if (message.channel.type !== ChannelType.GuildText) return;
        if ((message.channel as TextChannel).parentId !== category.id) return;

        const member = guild.members.cache.get(message.channel.name);

        if (!member) {
            await message.reply({
                embeds: [
                    errorEmbed('It seems like the member doesn\'t exists anymore on this server.')
                ]
            });

            return;
        };

        await member.send({
            content: `[**${message.author.tag}**] ${message.content}`,
            files: message.attachments.size > 0 ? [message.attachments.map((img) => img)[0].proxyURL] : null
        }).catch(async () => {
            await message.channel.send({
                embeds: [
                    errorEmbed('It seems like the member doesn\'t accept DMs anymore.')
                ]
            });

            return;
        });

        message.react('📨').catch(() => { });
    } else {
        const guild = client.guilds.cache.get(client.main_db.get('guild'));

        if (!guild) {
            await message.channel.send({
                embeds: [
                    errorEmbed('The ModMail system is not ready yet, please try again later.')
                ]
            });

            return;
        };

        const category = guild.channels.cache.get(client.main_db.get('category'));

        if (!category) {
            await message.channel.send({
                embeds: [
                    errorEmbed('The ModMail system is not ready yet, please try again later.')
                ]
            });

            return;
        };

        let channel = guild.channels.cache.find((channel) => channel.name === message.author.id && channel.parentId === category.id && channel.type === ChannelType.GuildText);

        if (channel) {
            let embed = new EmbedBuilder()
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL()
                })
                .setDescription(message.content.length >= 1 ? message.content : '** **')
                .setColor('Green')

            if (message.attachments.size) embed.setImage(message.attachments.map((img) => img)[0].proxyURL);

            (channel as TextChannel).send({
                embeds: [
                    embed
                ]
            });
        } else {
            let ban_check = client.bans_db.get(message.author.id);

            if (ban_check) {
                await message.reply({
                    embeds: [
                        errorEmbed('You are banned from using the ModMail system, with the reason below:\n> ' + ban_check)
                    ]
                });

                return;
            };

            channel = await guild.channels.create({
                name: message.author.id,
                type: ChannelType.GuildText,
                parent: category.id,
                topic: `Mail created by ${message.author} (${message.author.id})`
            }).catch(async () => {
                await message.channel.send({
                    embeds: [
                        errorEmbed('Failed to create a mail, please try again later.')
                    ]
                });

                return;
            }) || undefined;

            if (!channel) return;

            message.channel.send({
                embeds: [
                    successEmbed(`Your mail has been successfully created.\n**Guild:** ${guild.name}\n**Since:** ${createDiscordTimestamp(Date.now(), 'f')}`)
                ]
            });

            (channel as TextChannel).send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .addFields(
                            { name: 'Author', value: message.author.tag + ' (\`' + message.author.id + ')\`' },
                            { name: 'Created on', value: createDiscordTimestamp(Date.now(), 'D') + ' (' + createDiscordTimestamp(Date.now(), 'R') + ')' }
                        )
                        .setColor('Blurple')
                ],
            })

            channel.send({
                content: `[**${message.author.tag}**] ${message.content}`,
                files: message.attachments.size > 0 ? [message.attachments.map((img) => img)[0].proxyURL] : null
            });

            message.react('📨').catch(() => { });
        };
    };
});
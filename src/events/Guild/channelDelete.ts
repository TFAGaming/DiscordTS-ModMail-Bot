import { ChannelType, TextChannel } from "discord.js";
import { client } from "../..";
import { warningEmbed } from "../../util/functions";

client.on('channelDelete', async (channel) => {
    const guild = client.guilds.cache.get(client.main_db.get('guild'));

    if (!guild) return;

    const category = guild.channels.cache.get(client.main_db.get('category'));

    if (channel.type !== ChannelType.GuildText) return;
    if ((channel as TextChannel).parentId !== category.id) return;

    const user = client.users.cache.get(channel.name);

    if (!user) return;

    user.send({
        embeds: [
            warningEmbed('Your mail has been deleted. Please do not send any message now to avoid of creating a new mail for no reason.')
        ]
    }).catch(() => { });
});
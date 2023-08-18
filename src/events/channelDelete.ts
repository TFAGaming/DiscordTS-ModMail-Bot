import { TextChannel } from "discord.js";
import { client } from "..";
import config from "../config";

export default new client.handler.events.event({
    event: 'channelDelete',
    once: true,
    run: (_, channel) => {

        const guild = client.guilds.cache.get(config.modmail.guildId);

        if (!guild) return;

        const category = guild.channels.cache.find((v) => v.id === config.modmail.categoryId || v.name === 'ModMail');

        if ((channel as TextChannel).type !== 0 && (channel as TextChannel).parentId !== category?.id) return;

        client.db.mails.findOneAndDelete((v) => v.channelId === channel.id);

    }
});
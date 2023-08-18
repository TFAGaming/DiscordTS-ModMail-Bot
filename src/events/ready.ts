import { client } from "..";
import config from "../config";

export default new client.handler.events.event({
    event: 'ready',
    once: true,
    run: (_, clientReady) => {

        console.log('Logged in as: ' + clientReady.user.displayName);

        client.handler.commands.deploy(clientReady);

        const guild = client.guilds.cache.get(config.modmail.guildId);

        if (!guild) {
            console.log('Invalid guild ID provided in config.js.');
            process.exit(1);
        };

        const category = guild.channels.cache.find((v) => v.id === config.modmail.categoryId || v.name === 'ModMail');

        if (!category) {
            console.log('Invalid category ID provided in config.js and unable to find a category named \'ModMail\'.');
            process.exit(1);
        };

        console.log('Started checking the JSON files database...');

        const mails = client.db.mails.findMany((v) => v.guildId === guild.id);

        let found = 0;

        for (const mail of mails) {
            const channel = guild.channels.cache.get(mail.channelId);

            if (!channel) {
                found++;

                client.db.mails.findOneAndDelete((v) => v.channelId === mail.channelId);
            };
        };

        console.log('Total invalid mails found and deleted: ' + found);

        setInterval(() => {
            const all = client.db.bans.findMany((v) => v.guildId === guild.id);

            for (const data of all) {
                if (!data.duration) return;

                if (Date.now() > data.duration) {
                    client.db.bans.findOneAndDelete((v) => v.userId === data.userId);
                };
            };
        }, 1000);
    }
});
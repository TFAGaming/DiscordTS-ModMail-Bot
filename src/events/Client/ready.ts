import { client } from '../../index';
import { ActivityType } from 'discord.js';

client.once('ready', async () => {
    console.log('Logged in as ' + client.user.tag + '.');

    client.user.setPresence({
        status: 'dnd',
        activities: [{
            name: 'your mails.',
            type: ActivityType.Watching
        }]
    })
});

import { client } from '../index';

export default new client.handler.events.event({
    event: 'interactionCreate',
    run: (_, interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.handler.commands.collection.get(interaction.commandName);

        if (!command || command.type !== 1) return;

        try {
            command.run(client, interaction);
        } catch (e) {
            console.error(e);
        };
    }
});
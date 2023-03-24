import { Collection } from 'discord.js';
import { client } from '../../index';

const cooldown_map = new Collection<string, string[]>();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command: object = client.commands_collection.get(interaction.commandName);

    if (!command) return;

    try {
        if (command['options_data']) {
            let check_owner: boolean = false;

            if (interaction.user.id === process.env.OWNER_ID) check_owner = true;

            if (command['options_data']['owner_only']) {
                if (interaction.user.id !== process.env.OWNER_ID) {
                    await interaction.reply({
                        content: '\`❌\` This command is restricted for the owner only!',
                        ephemeral: true
                    });

                    return;
                } else check_owner = true;
            };

            if (command['options_data']['allowed_channels'] && command['options_data']['allowed_channels']['length'] > 0) {
                if (check_owner) {
                    command['run'](client, interaction, interaction.options);

                    return;
                };

                if (!command['options_data']['allowed_channels'].some((item) => item === interaction.channel.id)) {
                    const channels = command['options_data']['allowed_channels'].map((item) => `<#${item}>`)

                    await interaction.reply({
                        content: '\`❌\` This command is allowed in only these channels:\n' + channels.join(', ') + '.',
                        ephemeral: true
                    });

                    return;
                };
            };

            if (command['options_data']['cooldown']) {
                if (check_owner) {
                    command['run'](client, interaction, interaction.options);

                    return;
                };

                if (cooldown_map.has(interaction.user.id)) {
                    let data = cooldown_map.get(interaction.user.id);

                    if (data.some((item) => item === interaction.commandName)) {
                        await interaction.reply({
                            content: '\`❌\` **You are on cooldown!** You can try to use this command every ' + command['options_data']['cooldown'] / 1000 + ' second(s).',
                            ephemeral: true
                        });

                        return;
                    };
                } else {
                    cooldown_map.set(interaction.user.id, [interaction.commandName]);

                    setTimeout(async () => {
                        let data = cooldown_map.get(interaction.user.id);

                        data = data.filter((item) => item !== interaction.commandName);

                        if (data.length <= 0) {
                            cooldown_map.delete(interaction.user.id);
                        } else cooldown_map.set(interaction.user.id, data);
                    }, command['options_data']['cooldown']);
                };
            };
        };

        command['run'](client, interaction, interaction.options);
    } catch (err) {
        console.error('[ERROR] Something went wrong with the command \'' + interaction.commandName + '\'.\n' + err);
    };
});
import { Command } from "../../class/Command";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with the help menu.')
        .toJSON(),
    options_data: {
        cooldown: 5000
    },
    run: async (client, interaction, args) => {
        await interaction.deferReply();

        const commandsFetched = await client.application.commands.fetch();

        const commands: string[] = [];

        commandsFetched.forEach((cmd) => {
            if (cmd.options?.length > 0) {
                for (let option of cmd.options) {
                    if (option.type !== 1) continue;

                    commands.push(`</${cmd.name} ${option.name}:${cmd.id}>`)
                };
            } else {
                commands.push(`</${cmd.name}:${cmd.id}>`);
            };
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Here are my commands, click one of them to use!\n' + commands.join(', ') + '.')
                    .setColor('Blurple')
            ]
        });
    }
});

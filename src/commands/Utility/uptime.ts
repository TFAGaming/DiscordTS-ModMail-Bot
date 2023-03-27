import { Command } from "../../class/Command";
import { SlashCommandBuilder } from "discord.js";
import { createDiscordTimestamp } from "../../util/functions";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Check the client\'s uptime.')
        .setDMPermission(false)
        .toJSON(),
    options_data: {
        cooldown: 5000
    },
    run: async (client, interaction) => {
        const date = new Date().getTime() - (client.uptime);

        await interaction.reply({
            content: 'Started on: ' + createDiscordTimestamp(date, 'd') + ' (' + createDiscordTimestamp(date, 'R') + ')'
        });
    }
});

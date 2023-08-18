import { SlashCommandBuilder } from "discord.js";
import { client as defaultClient } from "..";

export default new defaultClient.handler.commands.command({
    type: 1,
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'Pong!'
        });

    }
});
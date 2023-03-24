import { Command } from "../../class/Command";
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Embed, CommandInteraction, StringSelectMenuInteraction } from "discord.js";

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

        await interaction.editReply({
            content: 'Soon...'
        });
    }
});

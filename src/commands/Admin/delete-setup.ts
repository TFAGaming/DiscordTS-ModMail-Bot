import { Command } from "../../class/Command";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { successEmbed } from "../../util/functions";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete the setup of the ModMail system.')
        .addSubcommand((sub) =>
            sub.setName('setup')
                .setDescription('Delete the setup of the ModMail system.')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .toJSON(),
    run: async (client, interaction, args) => {
        await interaction.deferReply();

        client.main_db.init();

        await interaction.editReply({
            embeds: [
                successEmbed('The setup has been deleted, no one can use the ModMail system.')
            ]
        });
    }
});

import { Command } from "../../class/Command";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { ChannelType } from "discord.js";
import { successEmbed } from "../../util/functions";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the ModMail system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .toJSON(),
    run: async (client, interaction, args) => {
        await interaction.deferReply();

        const channel = await interaction.guild.channels.create({
            name: 'ModMail',
            type: ChannelType.GuildCategory
        });

        client.main_db.set('guild', interaction.guild.id);
        client.main_db.set('category', channel.id);

        await interaction.editReply({
            embeds: [
                successEmbed('The ModMail is now ready, a category named **ModMail** has been created.')
            ]
        });
    }
});

import { Command } from "../../class/Command";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { errorEmbed } from "../../util/functions";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close an opened mail.')
        .addStringOption((opt) =>
            opt.setName('reason')
                .setDescription('The reason for closing the mail.')
                .setRequired(false)
        )
        .addStringOption((opt) =>
            opt.setName('additional-information')
                .setDescription('Any additional information for the author of the mail.')
                .setRequired(false)
        )
        .toJSON(),
    run: async (client, interaction, args) => {
        const reason = args.getString('reason') || 'No reason was provided';
        const additional_info = args.getString('additional-information') || 'None';

        const category = interaction.guild.channels.cache.get(client.main_db.get('category'));

        if (!category) {
            await interaction.reply({
                embeds: [
                    errorEmbed('This command is only executable in the ModMail category, somehow the category still doesn\'t exists.')
                ],
                ephemeral: true
            });

            return;
        };

        if (interaction.channel.parentId !== category.id) {
            await interaction.reply({
                embeds: [
                    errorEmbed('This command is only executable in the category name **' + category.name + '**.')
                ],
                ephemeral: true
            });

            return;
        };

        const member = interaction.guild.members.cache.get(interaction.channel.name);

        await interaction.channel.delete('[ModMail] A staff member has closed the mail.');

        if (!member) return;

        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`\`✅\` Your mail has been closed by a server moderator.\n**Moderator:** ${interaction.user}\n**Reason:** ${reason}\n**Additional Information:** ${additional_info}`)
                    .setColor('Green')
            ]
        }).catch(() => { });
    }
});

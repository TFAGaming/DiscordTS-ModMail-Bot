import { Command } from "../../class/Command";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { errorEmbed } from "../../util/functions";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('close-mail')
        .setDescription('Close an opened mail in the DM.')
        .setDMPermission(true)
        .toJSON(),
    run: async (client, interaction, args) => {
        if (interaction.guild) {
            await interaction.reply({
                embeds: [
                    errorEmbed('This command is only executable in the DMs (Direct Messages).')
                ],
                ephemeral: true
            });

            return;
        };

        const guild = client.guilds.cache.get(client.main_db.get('guild'));

        if (!guild) return;

        const category = guild.channels.cache.get(client.main_db.get('category'));

        if (!category) return;

        const channel = guild.channels.cache.find((channel) => channel.name === interaction.user.id && channel.parentId === category.id);

        if (!channel) {
            await interaction.reply({
                embeds: [
                    errorEmbed('You haven\'t created a mail yet.')
                ],
                ephemeral: true
            });

            return;
        };

        await channel.delete('[ModMail] A member has closed their own mail.');

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`\`✅\` You closed your own mail successfully.`)
                    .setColor('Green')
            ]
        }).catch(() => { });

        await interaction.reply({
            content: 'Done.',
            ephemeral: true
        });
    }
});

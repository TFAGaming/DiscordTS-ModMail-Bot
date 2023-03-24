import { Command } from "../../class/Command";
import { SlashCommandBuilder } from "discord.js";
import { errorEmbed, successEmbed } from "../../util/functions";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a guild member from using the ModMail system.')
        .addUserOption((opt) =>
            opt.setName('user')
                .setDescription('The user to ban.')
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('reason')
                .setDescription('The reason for the ban.')
                .setRequired(false)
        )
        .toJSON(),
    run: async (client, interaction, args) => {
        const user = args.getUser('user');
        const reason = args.getString('reason') || 'No reason was provided';

        let data_check = client.bans_db.get(user.id);

        if (data_check) {
            await interaction.reply({
                embeds: [
                    errorEmbed('The user is already banned.')
                ],
                ephemeral: true
            });

            return;
        };

        client.bans_db.set(user.id, reason);

        await interaction.reply({
            embeds: [
                successEmbed('The user <@' + user.id + '> has been successfully banned')
            ]
        });

        return;
    }
});

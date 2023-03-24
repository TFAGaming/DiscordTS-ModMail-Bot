import { Command } from "../../class/Command";
import { SlashCommandBuilder } from "discord.js";
import { errorEmbed, successEmbed } from "../../util/functions";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a guild member from using the ModMail system.')
        .addUserOption((opt) =>
            opt.setName('user')
                .setDescription('The user to unban.')
                .setRequired(true)
        )
        .toJSON(),
    run: async (client, interaction, args) => {
        const user = args.getUser('user');

        let data_check = client.bans_db.get(user.id);

        if (!data_check) {
            await interaction.reply({
                embeds: [
                    errorEmbed('The user is already unbanned.')
                ],
                ephemeral: true
            });

            return;
        };

        client.bans_db.del(user.id);

        await interaction.reply({
            embeds: [
                successEmbed('The user <@' + user.id + '> has been successfully unbanned')
            ],
            ephemeral: true
        });

        return;
    }
});

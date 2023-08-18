import { SlashCommandBuilder } from "discord.js";
import { client as defaultClient } from "..";
import ms = require("ms");

export default new defaultClient.handler.commands.command({
    type: 1,
    structure: new SlashCommandBuilder()
        .setName('modmail')
        .setDescription('ModMail manager.')
        .addSubcommand((sub) =>
            sub.setName('ban')
                .setDescription('Ban a user from using ModMail.')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The user to ban.')
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('reason')
                        .setDescription('The reason of the ban.')
                        .setRequired(false)
                )
                .addStringOption((opt) =>
                    opt.setName('duration')
                        .setDescription('The duration of the ban (example: 10s, 14d...).')
                        .setRequired(false)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('unban')
                .setDescription('Unban a user from using ModMail.')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The user to unban.')
                        .setRequired(true)
                )
        ),
    run: async (client, interaction) => {

        const { options } = interaction;

        switch (options.getSubcommand()) {
            case 'ban': {
                const user = options.getUser('user', true);
                const reason = options.getString('reason') || 'No reason was provided';
                const duration = options.getString('duration');

                const parsedMs = duration ? ms(duration) : undefined;

                const count = defaultClient.db.bans.count((v) => v.userId === user.id);

                if (count > 0) {
                    await interaction.reply({
                        content: 'That user is banned already.',
                        ephemeral: true
                    });

                    return;
                };

                defaultClient.db.bans.create({
                    userId: user.id,
                    reason: reason,
                    duration: parsedMs ? Date.now() + parsedMs : null,
                    guildId: interaction.guildId as string
                });

                await interaction.reply({
                    content: 'That user has been banned successfully.',
                    ephemeral: true
                });

                break;
            };

            case 'unban': {
                const user = options.getUser('user', true);

                const count = defaultClient.db.bans.count((v) => v.userId === user.id);

                if (count <= 0) {
                    await interaction.reply({
                        content: 'That user is not banned already.',
                        ephemeral: true
                    });

                    return;
                };

                defaultClient.db.bans.findOneAndDelete((v) => v.userId === user.id);

                await interaction.reply({
                    content: 'That user has been unbanned successfully.',
                    ephemeral: true
                });

                break;
            };
        };

    }
});
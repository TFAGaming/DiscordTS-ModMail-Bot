import { GuildMember, TimestampStylesString } from "discord.js";

export const wait = (ms: number) => {
    return new Promise((res) => setTimeout(res, ms));
};

export const time = (ms: number, style: TimestampStylesString) => {
    return `<t:${Math.floor(ms / 1000)}${style ? `:${style}>` : '>'}`;
};

export const permissionsCalculator = (member: GuildMember) => {
    let final = '';

    if (member.permissions.has('SendMessages')) {
        final = 'Member';
    };
    
    if (member.permissions.has('BanMembers') || member.permissions.has('KickMembers')) {
        final = 'Moderator';
    };
    
    if (member.permissions.has('ManageGuild')) {
        final = 'Manager';
    };
    
    if (member.permissions.has('Administrator')) {
        final = 'Administrator';
    };
    
    if (member.user.id === member.guild.ownerId) {
        final = 'Owner';
    };

    return final;
};
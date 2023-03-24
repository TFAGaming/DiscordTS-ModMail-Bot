import { EmbedBuilder } from "discord.js"

export function createDiscordTimestamp(timestamp: number, type?: string) {
    return `<t:${Math.floor(timestamp / 1000)}${type ? `:${type}` : ''}>`
};

export function errorEmbed(message: string) {
    return new EmbedBuilder()
        .setDescription('\`❌\` ' + message)
        .setColor('Red')
};

export function successEmbed(message: string) {
    return new EmbedBuilder()
        .setDescription('\`✅\` ' + message)
        .setColor('Green')
};

export function warningEmbed(message: string) {
    return new EmbedBuilder()
        .setDescription('\`⚠️\` ' + message)
        .setColor('Yellow')
};
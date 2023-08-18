import {
    Client,
    GatewayIntentBits,
    Partials
} from "discord.js";
import { CommandsHandler, EventsHandler, ComponentsHandler } from "horizon-handler";
import config from "../config";
import { JSONSchemaDB } from "@tfagaming/jsondb";

export class TypeScriptBot extends Client {
    handler = {
        commands: new CommandsHandler('./dist/commands/'),
        events: new EventsHandler('./dist/events/'),
        components: new ComponentsHandler('./dist/components/')
    };
    db = {
        mails: new JSONSchemaDB<{ id?: number, userId: string, channelId: string, guildId: string }>('./JSON/mails.json', { prettier: true, ids: { automatic: true } }),
        bans: new JSONSchemaDB<{ id?: number, userId: string, reason: string, guildId: string, duration: number | null }>('./JSON/bans.json', { prettier: true, ids: { automatic: true } })
    };

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent,
            ],
            partials: [
                Partials.Message,
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.User
            ]
        });
    };

    public start = async () => {
        await this.handler.commands.load();
        await this.handler.events.load(this);
        await this.handler.components.load(this);

        await this.login(config.client.token);
    };
};
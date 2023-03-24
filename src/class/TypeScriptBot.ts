import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
    SlashCommandBuilder
} from "discord.js";
import {
    readdirSync
} from 'fs';
import { JSONDatabase } from "./JSONDatabase";

export class TypeScriptBot extends Client {
    commands_collection = new Collection<string, object>();
    modules_collection = new Collection<string, string[]>();
    commands: object[] | SlashCommandBuilder[] = [];
    main_db: JSONDatabase = new JSONDatabase('./src/database/main.json', false);
    bans_db: JSONDatabase = new JSONDatabase('./src/database/bans.json', false);

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
            ],
            presence: {
                activities: [{
                    name: 'Starting up...',
                    type: ActivityType.Playing
                }]
            }
        });
    };

    public async load_commands(auto_deploy?: boolean) {
        for (const directory of readdirSync('./dist/commands/')) {
            for (const file of readdirSync('./dist/commands/' + directory + '/').filter((f) => f.endsWith('.js'))) {
                const command = require('../commands/' + directory + '/' + file).default; // Because we are exporting the files with 'default' keyword.

                if (command.command_data && typeof command.command_data === 'object' && command.command_data?.name) {
                    if (this.commands_collection.has(command.command_data?.name)) {
                        console.warn('[WARN] The file ' + file + ' is having the same property \'command_data.name\' from another file, this file has been skipped.');

                        continue;
                    };

                    if (this.modules_collection.has(directory)) {
                        let data: string[] = this.modules_collection.get(directory);

                        data.push(file);

                        this.modules_collection.set(directory, data);
                    } else this.modules_collection.set(directory, [file]);

                    this.commands.push(command.command_data);

                    this.commands_collection.set(command.command_data?.name, command);

                    console.log('Loaded a new command file: ' + file);
                } else {
                    console.warn('[WARN] The file ' + file + ' has been skipped due to missing property of \'command_data\' or \'command_data.name\'.');

                    continue;
                };
            };
        };

        if (auto_deploy) {
            this.deploy_commands();
        };

        return this;
    };

    public async load_events() {
        for (const directory of readdirSync('./dist/events/')) {
            for (const file of readdirSync('./dist/events/' + directory + '/').filter((f) => f.endsWith('.js'))) {
                require('../events/' + directory + '/' + file);

                console.log('Loaded a new event file: ' + file);
            };
        };

        return this;
    };

    public async deploy_commands() {
        console.log('[INFO] Deploying commands has been started.');

        const rest: REST = new REST({
            version: '10'
        }).setToken(process.env.CLIENT_TOKEN);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: this.commands }
        );

        console.log('[INFO] Deploying commands has been successfully finished.');

        return this;
    };

    public async delete_command(command_name: string, auto_deploy?: boolean) {
        if (!this.commands_collection.has(command_name)) return;

        this.commands_collection.delete(command_name);

        if (auto_deploy) {
            this.deploy_commands();
        };

        return this;
    };

    private async restart() {
        this.destroy();

        this.start();

        return this;
    };

    public async start() {
        this.login(process.env.CLIENT_TOKEN)
            .catch((err) => {
                console.error('[ERROR] Failed to login to the Discord bot.\n' + err);
            });

        return this;
    };

};
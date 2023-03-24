import { config as dotenv_config } from 'dotenv';
import { TypeScriptBot } from "./class/TypeScriptBot";

dotenv_config();

export const client: TypeScriptBot = new TypeScriptBot();

console.log(`
MODMAIL TYPESCRIPT DISCORD BOT, version: 1.0.0

████████╗░░░███████╗░░░░█████╗░
╚══██╔══╝░░░██╔════╝░░░██╔══██╗
░░░██║░░░░░░█████╗░░░░░███████║
░░░██║░░░░░░██╔══╝░░░░░██╔══██║
░░░██║░░░██╗██║░░░░░██╗██║░░██║
░░░╚═╝░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝

Thank you for using T.F.A#7524's project! :)
`)

client.load_commands(true);
client.load_events();

client.start();

process.on('unhandledRejection', console.error);

import { config } from 'dotenv';
import { TypeScriptBot } from './class/TypeScriptBot';

config();

export const client = new TypeScriptBot();

client.start();
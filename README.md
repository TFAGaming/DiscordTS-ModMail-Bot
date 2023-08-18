# DiscordTS-ModMail-Bot
A simple Discord ModMail bot built with TypeScript.

## Installation
Install `typescript` globally:

```sh
npm i -g typescript
```

Install all the required dependencies:

```sh
npm i discord.js@14 dotenv @tfagaming/jsondb
```

Rename the file **example.config.ts** (in **src/**) to **config.ts** and fill all the required properties.

To compile the TypeScript files to JavaScript files & run the compiled files, use the command below:

```sh
npm run build
```

> **Warning**
> The JSON files **bans.json** and **main.json** (in **JSON/**) are required, do not delete them so you will not get any error from the project.

## ModMail's moderation:
The ban and unban commands exists for the ModMail. Whenever you want to ban a user from using the ModMail system, use the slash command `/ban`, else use `/unban`. These both slash commands uses the JSON file called **bans.json**.

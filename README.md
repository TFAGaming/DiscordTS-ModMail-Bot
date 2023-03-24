# DiscordTS-ModMail-Bot
A simple Discord ModMail bot built with TypeScript.

## Installation
Install `typescript` globally:

```sh
npm i -g typescript
```

Install all the required dependencies:

```sh
npm i discord.js@14 dotenv
```

Rename the file **.env.example** to **.env** and fill all the required properties.

To compile the TypeScript files to JavaScript files & run the compiled files, use the command below:

```sh
npm run build
```

or, start the old compiled JavaScript files:

```sh
npm run build-start
```

## How the compiler works?
You can [click here](https://www.geeksforgeeks.org/how-typescript-compilation-works/) to understand how TypeScript compiler works.

## How to use the bot?
### Setup:
> **Warning**
> The JSON files **bans.json** and **main.json** are required, do not delete them so you will not get any error from the project.

When your bot is online and ready, use the slash command `/setup`. This is going to create a category in your server named **ModMail**, and it's going to save your server ID and the new category ID in a JSON file called **main.json**.

To delete the setup or avoid people from using the ModMail, use the slash command `/delete-setup`. This will initialize the JSON file **main.json** but it will not delete the category channel.

### Moderation:
The ban and unban commands exists for the ModMail. Whenever you want to ban a user from using the ModMail system, use the slash command `/ban`, else use `/unban`. These both slash commands uses the JSON file called **bans.json**.

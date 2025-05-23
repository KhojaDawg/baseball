import { SlashCommandBuilder } from "discord.js";
import { Command } from "./index";
import { VERSION } from "../util";


export const about_command: Command = {
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("Information about this bot and its author"),
	execute: async (interaction) => {
		let reply = "# Discord Baseball Bot\n";
		reply += `v${VERSION}\n\n`;
		reply += "Simulates baseball games between teams consisting of Discord server members for a silly fun group sports watching experience. Teams and player rosters are saved to the server they are created in, meaning that their info is private within a server, and that you can be registered to multiple different \"leagues\" in multiple different Discord servers. Every server has its own.\n";
		reply += "Send `/help` for a list of commands that the bot has to offer\n\n";
		reply += "Made by Khoja :3\nhttps://github.com/KhojaDawg/discord-baseball";
		interaction.reply(reply);
	}
}


export const help_command: Command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Lists available commands and their usage"),
	execute: async (interaction) => {
		let reply = "Available commands:\n";
		reply += "* `/players` used to manipulate or retrieve player data. Send `/players help` for player subcommands\n";
		reply += "* `/teams` used to manipulate or retrieve team data. Send `/teams help` for team subcommands\n";
		reply += "* `/game` used to simulate games. Currently only supports one subcommand: `/game simulate <home_team> <away_team>` where `<home_team>` and `<away_team>` are replaced with the names or UUIDs of the teams to simulate a game between.";
		await interaction.reply(reply);
	},
};


export const ping_command: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with \"Pong!\" to verify that the bot is reading slash commands"),
	execute: async (interaction) => { await interaction.reply("Pong!"); },
};

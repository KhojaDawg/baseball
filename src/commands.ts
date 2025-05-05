import { SlashCommandBuilder } from "discord.js";
import { teams } from "./database";
import { Game } from "./game";


export interface Command {
	data: SlashCommandBuilder,
	execute: Function,
};

export const commands: Command[] = [
	{
		data: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Replies with \"Pong!\" to verify that the bot is reading slash commands"),
		execute: async (interaction) => { await interaction.reply("Pong!"); },
	},
	{
		data: new SlashCommandBuilder()
			.setName("teams")
			.setDescription("Replies with a list of teams that are currently registered for the server"),
		execute: async (interaction) => {
			let reply = "Teams:\n";
			for (const team of teams) {
				reply += "\t" + team.name + "\n";
			}
			await interaction.reply(reply);
		},
	},
	{
		data: new SlashCommandBuilder()
			.setName("simulate")
			.setDescription("Simulates a game between two saved teams and prints the results"),
		execute: async (interaction) => {
			let game = new Game(teams[0], teams[1]);
			game.simulate();
			let reply;
			if (game.home_team.score > game.away_team.score) {
				reply = `${game.home_team.name} wins!`;
			} else {
				reply = `${game.away_team.name} wins!`;
			}
			reply += `\n\tFinal score: ${game.home_team.score}-${game.away_team.score}`;
			await interaction.reply(reply);
		}
	}
];

import { SlashCommandBuilder } from "discord.js";
import { Command } from "./index";


export const players: Command = {
	data: new SlashCommandBuilder()
		.setName("players")
		.setDescription("Manipulates player data. Allows creating, editing, and getting lists of players"),
	execute: async (interaction) => { await interaction.reply("Pong!"); },
};

export default players;

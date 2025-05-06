import { SlashCommandBuilder } from "discord.js";
import { Command } from "./index";


export const ping: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with \"Pong!\" to verify that the bot is reading slash commands"),
	execute: async (interaction) => { await interaction.reply("Pong!"); },
};

export default ping;

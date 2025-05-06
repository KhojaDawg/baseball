import { SlashCommandBuilder } from "discord.js";
import { Command } from "./index";
import { Teams } from "../database";


export const teams: Command = {
	data: new SlashCommandBuilder()
		.setName("teams")
		.setDescription("Manipulation of teams, such as adding new teams, editing existing teams, or retrieving team data")
		.addSubcommand(subcommand => 
			subcommand
				.setName("create")
				.setDescription("Creates a new team in your Discord server")
				.addStringOption(option => option.setName("team_name").setDescription("New team name"))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Lists all teams in this discord server. For detailed info on a specific team, see `get` subcommand")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("get")
				.setDescription("Gets a specific team's info. To return a list of all teams on the server, see `list` subcommand")
				.addStringOption(option => option.setName("id").setDescription("ID of the team you wish to get info for"))
		),
	execute: async (interaction) => {
		// console.log("Executing team command");
		const guild_id = interaction.guild.id
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "list") {
			const teams = await Teams.findAll({where: { guild: interaction.guild.id }});
			if (teams.length > 0) {
				let reply = "Teams:\n";
				for (const team of teams) {
					reply += `* Name: ${team.get("name")} UUID: ${team.get("uuid")}\n`;
				}
				await interaction.reply(reply);
			} else {
				await interaction.reply("No teams registered yet. Use `/teams create <team_name>` to create a new one");
			}
		} else if (subcommand === "create") {
			;
			const team_name = interaction.options.getString("team_name");
			console.log(`Creating new team ${team_name} for guild ${guild_id}`);
			const new_team = await Teams.create({ name: team_name, guild: interaction.guild.id });
			if (new_team) {
				await interaction.reply(`New team ${new_team.get("name")} created (UUID ${new_team.get("uuid")})`);
			} else {
				await interaction.reply("Error: no new team created");
			}
		} else {
			await interaction.reply("Not implemented");
		}
	},
};

export default teams;

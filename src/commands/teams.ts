import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Op } from "sequelize";
import { Command } from "./index";
import { Player, Team, createRandomPlayer, all_positions } from "../database";


async function execute_list_subcommand(interaction: ChatInputCommandInteraction): Promise<any> {
	const guild_id = interaction.guild.id
	const teams = await Team.findAll({where: { guild: guild_id }});
	if (teams.length > 0) {
		let reply = "Teams:\n";
		for (const team of teams) {
			reply += `* Name: ${team.name} UUID: ${team.uuid} Guild: ${team.guild}\n`;
		}
		await interaction.reply(reply);
	} else {
		await interaction.reply("No teams registered yet. Use `/teams create <team_name>` to create a new one");
	}
}


async function execute_create_subcommand(interaction: ChatInputCommandInteraction): Promise<any> {
	const guild_id = interaction.guild.id
	const team_name = interaction.options.getString("team_name");
	console.log(`Creating new team ${team_name} for guild ${guild_id}`);
	const new_team = await Team.create({ name: team_name, guild: guild_id });
	if (new_team) {
		await interaction.reply(`New team ${new_team.get("name")} created (UUID ${new_team.get("uuid")})`);
	} else {
		await interaction.reply("Error: no new team created");
	}
}


async function execute_fill_subcommand(interaction: ChatInputCommandInteraction): Promise<any> {
	const guild_id = interaction.guild.id
	const team_search = interaction.options.getString("team_name");
	let teams: Team[] = [];
	let reply = "";
	if (team_search) {
		console.log(`Filling team ${team_search} with random players`);
		const team: Team = await Team.findOne({ where: { [Op.or]: [{ uuid: team_search }, { name: team_search }], guild: guild_id } });
		if (team) {
			reply += `Filling empty slots in team ${team.name} with randomly generated players`;
			teams.push(team);
		} else {
			await interaction.reply("Could not find a matching team in this server");
			return;
		}
	} else {
		console.log(`Filling all empty team slots in guild ${guild_id}`);
		reply += "Filling all empty team slots in this server with randomly generated players";
		teams = await Team.findAll({ where: { guild: guild_id } });
	}
	// fill slots
	for (let i: number = 0; i < teams.length; i += 1) {
		const team: Team = teams[i];
		console.log(`\tFilling slots for team ${team.name}`);
		const new_players: Player[] = [];
		
		for (const position of all_positions()) {
			const position_count: number = await Player.count({
				where: { position: position },
				include: { model: Team, where: { uuid: team.uuid } }
			});
			if (position_count == 0) {
				console.log(`\tCreating new ${position}`);
				new_players.push(await createRandomPlayer(position, guild_id));
			}
		}
		team.addPlayers(new_players);
	}
	// respond
	await interaction.reply(reply);
}


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
				.setName("get")
				.setDescription("Gets a specific team's info. To return a list of all teams on the server, see `list` subcommand")
				.addStringOption(option => option.setName("uuid").setDescription("UUID of the team you wish to get info for"))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Lists all teams in this discord server. For detailed info on a specific team, see `get` subcommand")
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("fill")
				.setDescription("Fills any empty spaces in the given team with randomly generated characters")
				.addStringOption(option => option.setName("team_name").setDescription("Name or UUID of team to fill"))
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
		// console.log("Executing team command");
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "list") await execute_list_subcommand(interaction);
		else if (subcommand === "create") await execute_create_subcommand(interaction);
		else if (subcommand === "fill") await execute_fill_subcommand(interaction);
		else await interaction.reply("Not implemented");
	},
};
export default teams;

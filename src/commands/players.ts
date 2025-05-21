import { ChatInputCommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { Op } from "sequelize";
import { Command } from "./index";
import { Position, Player, Team } from "../database";


export const players: Command = {
	data: new SlashCommandBuilder()
		.setName("players")
		.setDescription("Manipulates player data. Allows creating, editing, and getting lists of players")
		.addSubcommand(subcommand =>
			subcommand
				.setName("register")
				.setDescription("Register yourself as a player in your Discord server's league")
				.addStringOption(option => option.setName("team").setDescription("Team you wish to join"))
				.addStringOption(option => option.setName("position").setDescription("Position you wish to play").addChoices(
					{ name: "Pitcher", value: Position.Pitcher },
					{ name: "Catcher", value: Position.Catcher },
					{ name: "First Base", value: Position.FirstBase },
					{ name: "Second Base", value: Position.SecondBase },
					{ name: "Third Base", value: Position.ThirdBase },
					{ name: "Shortstop", value: Position.Shortstop },
					{ name: "Left Field", value: Position.LeftField },
					{ name: "Center Field", value: Position.CenterField },
					{ name: "Right Field", value: Position.RightField },
				))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("List players in your Discord server's league")
				.addStringOption(option => option.setName("team").setDescription("Team to list players for"))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("edit")
				.setDescription("Edit the properties of the given player")
				.addStringOption(option => option.setName("target").setDescription("Target player to edit"))
				.addStringOption(option => option.setName("name").setDescription("Renames the player to the given name"))
				.addStringOption(option => option.setName("team").setDescription("Team to assign the player to"))
				.addStringOption(option => option.setName("position").setDescription("Position you wish to play").addChoices(
					{ name: "Pitcher", value: Position.Pitcher },
					{ name: "Catcher", value: Position.Catcher },
					{ name: "First Base", value: Position.FirstBase },
					{ name: "Second Base", value: Position.SecondBase },
					{ name: "Third Base", value: Position.ThirdBase },
					{ name: "Shortstop", value: Position.Shortstop },
					{ name: "Left Field", value: Position.LeftField },
					{ name: "Center Field", value: Position.CenterField },
					{ name: "Right Field", value: Position.RightField },
				))
		),
	
	execute: async (interaction) => {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "register") await execute_register_subcommand(interaction);
		else if (subcommand === "list") await execute_list_subcommand(interaction);
		else if (subcommand === "edit") await execute_edit_subcommand(interaction);
		else await interaction.reply(`Error: no subcommand "${subcommand}" for "players" command`);
		
	},
};


// Handles the `"register"` subcommand
async function execute_register_subcommand(interaction: ChatInputCommandInteraction): Promise<any> {
	const guild_id: string = interaction.guild.id;
	const user: User = interaction.user;
	const existing_player = await Player.findOne({ where: { discord_user: user.id, guild: guild_id } });
	if (existing_player) {
		await interaction.reply(`Your have already been registered as a player in this server (uuid: ${existing_player.uuid})`);
	} else {
		const position: Position = interaction.options.getString("position") as Position;
		const new_player = await Player.create({
			guild: guild_id, name: user.displayName, discord_user: user.id,
			position: position ?? null,
		});
		const team_search = interaction.options.getString("team");
		if (team_search) {
			const team = await Team.findOne({ where: { [Op.or]: [{ uuid: team_search }, { name: team_search }], guild: guild_id } });
			if (team) {
				await new_player.setTeam(team);
				await team.addPlayer(new_player)
				await interaction.reply(`New player ${new_player.name} created for user ${new_player.discord_user}. Position: ${new_player.position} Team: ${team.name}`);
			} else {
				await interaction.reply(`No team found with the given name or UUID. New player ${new_player.name} created for ${new_player.discord_user} as free agent. Position: ${new_player.position}`);
			}
		}
		else {
			await interaction.reply(`New player ${new_player.name} created for user ${new_player.discord_user} as free agent. Position: ${new_player.position}`)
		}
	}
}


// Handles the `"list"` subcommand
async function execute_list_subcommand(interaction: ChatInputCommandInteraction): Promise<any> {
	const guild_id: string = interaction.guild.id;
	const team_search: string = interaction.options.getString("team");
	let players: Player[];
	let reply = "List of players ";
	if (team_search) {
		const team = await Team.findOne({ where: { [Op.or]: [{ uuid: team_search }, { name: team_search }], guild: guild_id } });
		players = await team.getPlayers();
		reply += `on team ${team.name}:\n`;
	} else {
		players = await Player.findAll({ where: { guild: guild_id } });
		reply += "in the league:\n";
	}
	if (!players || players.length <= 0) {
		reply += "No players found";
	} else {
		for (const player of players) {
			reply += `* ${player.name} (${player.uuid}) ${player.position}\n`;
		}
	}
	await interaction.reply(reply);
}


// Handles the `"rename"` subcommand
async function execute_edit_subcommand(interaction: ChatInputCommandInteraction): Promise<any> {
	const guild_id = interaction.guild.id;
	let player: Player;
	const player_search = interaction.options.getString("target");
	// search for player
	if (player_search) {
		player = await Player.findOne({ where: { [Op.or]: [{ uuid: player_search }, { name: player_search }], guild: guild_id } });
	} else {
		player = await Player.findOne({ where: { discord_user: interaction.user.id, guild: guild_id } });
	}
	// update player
	if (player) {
		let message = `Updating player ${player.name} (${player.uuid}):`;
		const new_name = interaction.options.getString("name");
		const new_position = interaction.options.getString("position");
		const new_team_search = interaction.options.getString("team");
		if (new_name) {
			message += `\n\tUpdating player name to ${new_name}`;
			player.name = new_name;
		}
		if (new_position) {
			message += `\n\tUpdating player's position to ${new_position}`;
			player.position = new_position as Position;
		}
		if (new_team_search) {
			const former_team: Team = await player.getTeam();
			const new_team: Team = await Team.findOne({ where: { [Op.or]: { name: new_team_search, uuid: new_team_search }, guild: guild_id } });
			message += `\n\tAssigning player to team ${new_team.name}`;
			former_team.removePlayer(player);
			player.setTeam(new_team);
			new_team.addPlayer(player);
			former_team.save();
			new_team.save();
		}
		player.save();
		await interaction.reply(`Player information updated`);
	}
	else {
		await interaction.reply("No player found");
	}
	player.save();
}


export default players;

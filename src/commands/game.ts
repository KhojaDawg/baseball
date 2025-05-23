import { ChatInputCommandInteraction, SlashCommandBuilder, StageChannel, TextChannel, ThreadAutoArchiveDuration, User } from "discord.js";
import { Op } from "sequelize";
import { Command } from "./index";
import { Position, Player, Team, Game } from "../database";
import { sleep, random } from "../util";

//         1  2  3
// Team A 99 99 99
// Team B 99 99 99

// Wait this many seconds between each game event in milliseconds (ms)
const GAME_EVENT_WAIT_TIME: number = 4000;


async function execute_simulate_game_subcommand(interaction: ChatInputCommandInteraction): Promise<any> {
	// get options
	const guild_id: string = interaction.guild.id;
	const home_team_search: string = interaction.options.getString("home_team");
	const away_team_search: string = interaction.options.getString("away_team");
	const innings = interaction.options.getNumber("innings") ?? 9;
	// get teams
	const home_team: Team = await Team.findOne({
		where: {
			guild: guild_id,
			[Op.or]: { uuid: home_team_search, name: home_team_search }
		}
	});
	const away_team: Team = await Team.findOne({
		where: {
			guild: guild_id,
			[Op.or]: { uuid: away_team_search, name: away_team_search }
		}
	});
	if (!home_team) {
		await interaction.reply("Unable to find home team");
		return;
	} else if (!away_team) {
		await interaction.reply("Unable to find away team");
		return;
	}
	await interaction.reply("Creating a thread for the game");
	// create thread
	const now = new Date();
	const game_name_teams = `${away_team.name} @ ${home_team.name}`;
	const game_name_timestamp = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`;
	const game_name = `${game_name_teams} ${game_name_timestamp}`;
	const channel: TextChannel = interaction.channel as TextChannel;
	const thread = await channel.threads.create({
		name: game_name,
		autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
		reason: `Simulating a game between ${home_team.name} and ${away_team.name}`,
	});
	// simulate game
	const game: Game = await Game.create({
		guild: guild_id, home_team_uuid: home_team.uuid, away_team_uuid: away_team.uuid,
	});
	await thread.send(`Welcome to a ${innings} inning game between team ${home_team.name} and team ${away_team.name}`);
	await sleep(GAME_EVENT_WAIT_TIME);
	while (game.half_inning < innings * 2) {
		// set batting and fielding teams for this half-inning
		let batting_team: Team;
		let fielding_team: Team;
		if (game.half_inning % 2 == 0) {
			batting_team = away_team;
			fielding_team = home_team;
		} else {
			batting_team = home_team;
			fielding_team = away_team;
		}
		// get the pitcher and batting lineup for this half-inning
		const pitcher: Player = await Player.findByPosition(Position.Pitcher, guild_id, fielding_team.uuid);
		const batters: Player[] = await batting_team.getPlayers();
		// simulate half-inning
		await thread.send(`# ${game.inning_name()}\n${batting_team.name} are batting while ${fielding_team.name} take the field, with ${pitcher.name} pitching`);
		await sleep(GAME_EVENT_WAIT_TIME);
		// simulate at-bats until 3 outs are reached
		while (game.outs < 3) {
			// get current batter
			const batter = batters[batting_team.at_bat % batters.length];
			await thread.send(`${batter.name} goes up to bat for the ${batting_team.name}. The score is ${game.home_score} to ${game.away_score} with ${game.outs} outs`);
			await sleep(GAME_EVENT_WAIT_TIME);
			// simulate at-bat - loop pitches while strikes is fewer than 3
			while (game.strikes < 3) {
				if (random.random_int(0, 3) == 0) {
					game.score_run(batting_team.uuid);
					await thread.send(`Hit for a run! ${game.home_score}-${game.away_score}`);
					await sleep(GAME_EVENT_WAIT_TIME);
					break;
				} else {
					game.strikes += 1;
					let message = `Strike ${game.strikes}!`
					if (game.strikes >= 3) {
						message += ` ${batter.name} strikes out!`;
						game.outs += 1;
					}
					await thread.send(message);
					await sleep(GAME_EVENT_WAIT_TIME);
				}
			}
			// increment and reset variables for next at-bat
			batting_team.at_bat += 1;
			game.strikes = 0;
			game.balls = 0;
		}
		// increment and reset variables for next half-inning
		game.outs = 0;
		game.half_inning += 1;
	}
	let winning_team = null;
	if (game.home_score > game.away_score) winning_team = home_team;
	else if (game.away_score > game.home_score) winning_team = away_team;
	let final_message = `Game over! Final score: ${home_team.name} ${game.home_score} ${away_team.name} ${game.away_score}\n`;
	if (winning_team) {
		final_message += `${winning_team.name} win!!!`;
	} else {
		final_message += `It's a tie!`;
	}
	await thread.send(final_message);
}


export const game_command: Command = {
	data: new SlashCommandBuilder()
		.setName("game")
		.setDescription("Simulate games or get information about past games")
		.addSubcommand(subcommand => 
			subcommand
				.setName("simulate")
				.setDescription("simulate a game between two teams")
				.addStringOption(option => option.setName("home_team").setDescription("Name or UUID of the home team in the simulated game").setRequired(true))
				.addStringOption(option => option.setName("away_team").setDescription("Name or UUID of the away team in the simulated game").setRequired(true))
				.addNumberOption(option => option.setName("innings").setDescription("Number of innings to play").setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("help")
				.setDescription("Show a list of `game` subcommands and their usage")
		),
	execute: async (interaction: ChatInputCommandInteraction) => {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "simulate") await execute_simulate_game_subcommand(interaction)
		else if (subcommand === "help") {
			let reply = "`/game <subcommand>` list of possible subcommands\n";
			reply += "* `simulate <home_team> <away_team> <?innings>` simulates a game between the given `<home_team>` and `<away_team>`. Teams can be specified by either their name or UUID, as long as it is an exact case sensitive match. Optionally, you can provide a number for `<innings>` that determines how many innings to play. If ommitted, defaults to 9 innings.\n";
			await interaction.reply(reply);
		}
		else await interaction.reply(`Unknown subcommand ${subcommand}`);
	}
}


export default game_command;

import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { players_command } from "./players";
import { teams_command } from "./teams";
import { game_command } from "./game";
import { about_command, help_command, ping_command } from "./util";


interface Command {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
	execute: Function,
};

const commands_list: Command[] = [
	players_command, teams_command, game_command, about_command, help_command, ping_command,
];


export { Command, commands_list };

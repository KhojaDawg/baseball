import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import ping from "./ping";
import players from "./players";
import teams from "./teams";
import game_commands from "./game";


export interface Command {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
	execute: Function,
};

export const commands: Command[] = [
	ping, players, teams, game_commands,
];

export default commands;

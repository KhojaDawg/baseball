import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import { commands as commands_list, Command } from "./commands";
import { Game, Player, Team } from "./database";


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands: Collection<string, Command> = new Collection();
for (const command of commands_list) {
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if (command.data && command.execute) {
		commands.set(command.data.name, command);
	} else {
		console.warn(`command is missing a required "data" or "execute" property.`);
		console.warn(command);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.once(Events.ClientReady, async readyClient => {
	console.log("Setting up database");
	await Player.sync();
	await Team.sync();
	await Game.sync();
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


export default client;

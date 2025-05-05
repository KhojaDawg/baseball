import "dotenv/config";
import { REST, Routes } from "discord.js";
import { commands } from "./src/commands";


const commands_json = [];

for (const command of commands) {
	// console.log(`Registering command ${command.data.name}`);
	// Create an array of command JSON data
	if (command.data && command.execute) {
		commands_json.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands_json.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
			{ body: commands_json },
		);

		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

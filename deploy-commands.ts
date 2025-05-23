import "dotenv/config";
import { REST, Routes } from "discord.js";
import { commands_list } from "./src/commands";


const commands_json = [];

for (const command of commands_list) {
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

		// If a GUILD_ID environment variable is provided, update commands for the specific guild
		// (faster for testing). Otherwise update the commands globally (significantly slower)
		if (process.env.GUILD_ID) {
			console.log(`Updating bot commands for guild ${process.env.GUILD_ID}`);
			await rest.put(
				Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
				{ body: commands_json },
			);
		}
		else {
			console.log("Updating bot commands globally");
			await rest.put(
				Routes.applicationCommands(process.env.APP_ID),
				{ body: commands_json },
			);
		}

		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

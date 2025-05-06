import "dotenv/config";
import { client } from "./src/bot.js";
import { Players, Teams } from "./src/database";


async function main() {
	console.log("Setting up database");
	await Players.sync();
	await Teams.sync();
	console.log("Logging into discord");
	client.login(process.env.TOKEN);
}


main();

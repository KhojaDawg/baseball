import "dotenv/config";
import client from "./src/bot.js";


async function main() {
	console.log("Logging into discord");
	client.login(process.env.TOKEN);
}


main();

import "dotenv/config";
import { client as bot } from "./src/bot.js";
import { load_team_data } from "./src/data";



load_team_data().then(() => {
	bot.login(process.env.TOKEN);
});

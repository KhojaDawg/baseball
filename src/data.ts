import * as fs from "fs";
import { teams } from "./database";
import { Player } from "./player";
import { Team } from "./team";


export async function load_team_data() {
    const team_data_path = process.env.TEAM_DATA_PATH ? process.env.TEAM_DATA_PATH : "./data/teams.json";
    console.log(`Reading team data from ${team_data_path}`);
    const json_team_data = await fs.promises.readFile(team_data_path, "utf-8");
    const loaded_team_data = JSON.parse(json_team_data);

    // console.log(loaded_team_data);

    for (const team_data of loaded_team_data) {

        // console.log(team_data);

        const new_team = new Team(team_data["name"]);
        const players = team_data["players"];

        // console.log(players);

        for (let i = 0; i < players.length; i += 1) {
            let position = i;
            let player_data = players[i];
            let player = new Player(player_data["name"]);
            new_team.add_player(player, position);
        }
        teams.push(new_team);
    }
};

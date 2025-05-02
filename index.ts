import "dotenv/config";
import * as fs from "fs";
import { teams } from "./src/database";
import { Player, Position } from "./src/player";
import { Team } from "./src/team";
import { Game } from "./src/game";

async function load_team_data(): Promise<void> {
    const team_data_path = process.env.TEAM_DATA_PATH ? process.env.TEAM_DATA_PATH : "./data/teams.json";
    console.log(team_data_path);
    const json_team_data = await fs.promises.readFile(team_data_path, "utf-8");
    const loaded_team_data = JSON.parse(json_team_data);

    // console.log(loaded_team_data);

    for (const team_data of loaded_team_data) {

        // console.log(team_data);

        const new_team: Team = new Team(team_data["name"]);
        const players: Object[] = team_data["players"];

        // console.log(players);

        for (let i: number = 0; i < players.length; i += 1) {
            let position: Position = i;
            let player_data = players[i];
            let player = new Player(player_data["name"]);
            new_team.add_player(player, position);
        }
        teams.push(new_team);
    }
};

load_team_data().then(() => {
    let game: Game = new Game(teams[0], teams[1]);
    game.simulate();
});

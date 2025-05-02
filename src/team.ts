import { Player, Position } from "./player";
import { random_int as rand_int } from "./random";


export interface Positions {
    [index: number]: Player;
}

export class Team {
    name: string = "";
    players: Player[] = [null, null, null, null, null, null, null, null, null];
    at_bat: number = 0;
    score: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    // Add an existing player to the team
    add_player(player: Player, position: Position) {
        player.team = this;
        player.jersey_number = rand_int(0, 99);
        this.players[position] = player;
    }

    get_position_player(position: Position): Player {
        return this.players[position];
    }
}
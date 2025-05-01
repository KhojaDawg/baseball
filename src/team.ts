import { players } from "./database";
import { Player, PlayerHandle, Position } from "./player";
import { random_int as rand_int } from "./random";


export interface Positions {
    [index: number]: Player;
}

export class Team {
    name: string = "";
    players: Player[] = [];
    positions: Positions = [null, null, null, null, null, null, null, null, null];
    at_bat: number = 0;
    score: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    // Add an existing player to the team
    add_player(player: Player, position: Position | null) {
        player.team = this;
        player.jersey_number = rand_int(0, 99);
        this.players.push(player);
        if (position != null) {
            this.set_player_position(position, player);
        }
    }

    // Create a new player and add them to the players database as a member of this team
    add_new_player(handle: PlayerHandle, player: Player, position: Position | null) {
        players[handle] = player;
        this.add_player(player, position);
    }

    set_player_position(position: Position, player: Player | null = null) {
        // console.log(`Setting position ${position} for player ${player}`);
        // console.log(`\tPositions: ${this.positions}`)
        this.positions[position] = player;
    }

    get_player_by_position(position: Position): Player {
        return this.positions[position];
    }
}
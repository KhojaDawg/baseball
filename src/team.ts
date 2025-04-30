import { Player, PlayerHandle } from "./player"


export enum Position {
    Pitcher = 0,
    Catcher = 1,
    FirstBase = 2,
    SecondBase = 3,
    ThirdBase = 4,
    Shortstop = 5,
    LeftField = 6,
    CenterField = 7,
    RightField = 8,
}

export interface Positions {
    [index: number]: string;
}

export class Team {
    name: string = "";
    players: PlayerHandle[] = [];
    positions: Positions = [null, null, null, null, null, null, null, null, null];

    constructor(name: string) {
        this.name = name;
    }

    add_player(handle: PlayerHandle, position: Position | null) {
        // console.log(`Team ${this.name}: adding player ${handle} at position ${position}`)
        this.players.push(handle);
        // console.log(`\tPlayers: ${this.players}`);
        if (position != null) {
            this.set_player_position(position, handle);
        }
    }

    set_player_position(position: Position, player?: PlayerHandle) {
        // console.log(`Setting position ${position} for player ${player}`);
        // console.log(`\tPositions: ${this.positions}`)
        this.positions[position] = player;
    }

    get_player_by_position(position: Position): PlayerHandle {
        return this.positions[position];
    }
}
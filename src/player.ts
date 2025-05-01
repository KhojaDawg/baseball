import { Team } from "./team";


export type PlayerHandle = string;

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

// Based on [Wikipedia's *Baseball Statistics* article](https://en.wikipedia.org/wiki/Baseball_statistics#Contemporary_statistics)
export class Statistics {
    // `K`
    strike_outs: number = 0;
    // `PA`
    plate_appearances: number = 0;
    // `R` number of times a player crosses home plate
    runs_scored: number = 0;
}

export class Player {
    // Player's display name
    name: string;
    jersey_number: number;
    team: Team;
    stats: Statistics;
    position: Position | null;
    
    constructor(name: string) {
        this.name = name
        this.stats = new Statistics();
    }
}
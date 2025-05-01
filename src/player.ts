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
    // `AB`
    at_bats: number = 0;
    // `BB`
    base_on_balls: number = 0;
    // `H`
    hits: number = 0;
    // `HR`
    home_runs: number = 0;
    // `K`
    strike_outs: number = 0;
    // `PA`
    plate_appearances: number = 0;
    // `R` number of times a player crosses home plate
    runs_scored: number = 0;
    // `RBI`
    runs_batted_in: number = 0;
    // `TB`
    total_bases: number = 0;

    // `BA`
    batting_average(): number {
        return this.hits / this.at_bats;
    }

    // `SLG`
    slugging_percentage(): number {
        return this.total_bases / this.at_bats * 100.0;
    }

    // `TOB`
    times_on_base(): number {
        return this.hits + this.base_on_balls;
    }
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
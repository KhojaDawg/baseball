export type PlayerHandle = string;


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
    stats: Statistics;
    
    constructor(name: string) {
        this.name = name
        this.stats = new Statistics();
    }
}
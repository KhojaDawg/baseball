import { Player, PlayerHandle } from "./player";
import { random_int as rand_int } from "./random";
import { Team, Position } from "./team";
import { ordinal } from "./util";


export class Game {
    home_team: Team;
    away_team: Team;
    players: Object;
    half_inning: number = 0;
    at_bat_home: number = 0;
    at_bat_away: number = 0;
    current_balls: number = 0;
    current_strikes: number = 0;
    current_outs: number = 0;
    bases: PlayerHandle | null [] = [null, null, null];

    constructor(home_team: Team, away_team: Team, players: Object) {
        this.home_team = home_team;
        this.away_team = away_team;
        this.players = players;
    }

    simulate() {
        console.log(`Simulating game between ${this.home_team.name} and ${this.away_team.name}`);
        this.home_team.score = 0;
        this.away_team.score = 0;
        while (this.half_inning <= 17 || this.home_team.score == this.away_team.score) {
            this.simulate_inning(this.home_team, this.away_team);
            this.simulate_inning(this.away_team, this.home_team);
        }
        console.log(`Final score: ${this.home_team.score}-${this.away_team.score}`);
        if (this.home_team.score > this.away_team.score) {
            console.log(`${this.home_team.name} win!`);
        } else {
            console.log(`${this.away_team.name} win!`);
        }
    }

    simulate_inning(batting: Team, fielding: Team) {
        const pitcher: Player = this.players[fielding.get_player_by_position(Position.Pitcher)];
        this.print_half_inning();
        console.log(`${fielding.name} take the field! Pitcher: ${pitcher.name}`);
        while (this.current_outs < 3) {
            const batter_handle = batting.players[batting.at_bat % batting.players.length];
            const batter = this.players[batter_handle];
            this.simulate_at_bat(batter, batting, fielding);
            batting.at_bat += 1;
        }
        this.current_outs = 0;
        this.half_inning += 1;
    }

    simulate_at_bat(batter: Player, batting: Team, fielding: Team) {
        const pitcher: Player = this.players[fielding.get_player_by_position(Position.Pitcher)];
        console.log(`\tAt bat: ${batter.name}`);
        while (this.current_strikes < 3) {
            const result = rand_int(0, 2);
            if (result == 0) {
                this.current_balls += 1;
                console.log(`\t\tBall! ${this.current_balls}-${this.current_strikes}-${this.current_outs}`);
            }
            else if (result == 1) {
                this.current_strikes += 1;
                console.log(`\t\tStrike! ${this.current_balls}-${this.current_strikes}-${this.current_outs}`);
            }
            else if (result == 2) {
                console.log(`\t\tHit!`);
                const bases = rand_int(0, 3);
                if (bases == 0) {
                    batting.score += 1;
                    console.log(`\t\tSCORE! ${this.home_team.score}-${this.away_team.score}`);
                    batter.stats.runs_scored += 1;
                    break;
                } else {
                    this.current_outs += 1;
                    console.log(`\t\tOUT! ${this.current_outs}`);
                    break;
                }
            }
            else {
                throw new RangeError(`Invalid batting result: ${result}`);
            }
        }
        if (this.current_strikes >= 3) {
            this.current_outs += 1;
            console.log(`\t\tSTRIKEOUT! ${this.current_outs}`);
            batter.stats.strike_outs += 1;
        }
        batter.stats.plate_appearances += 1;
        this.current_balls = 0;
        this.current_strikes = 0;
    }

    print_half_inning() {
        const inning = Math.floor(this.half_inning / 2) + 1;
        let frame = "top";
        if (this.half_inning % 2 != 0) {
            frame = "bottom";
        }
        console.log(`${frame} of the ${ordinal(inning)} ${this.home_team.score}-${this.away_team.score}`);
    }
}

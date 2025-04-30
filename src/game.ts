import { Player, PlayerHandle } from "./player";
import { Team, Position } from "./team";
import { ordinal } from "./util";


export class Game {
    home_team: Team;
    away_team: Team;
    players: Object;
    score_home: number = 0;
    score_away: number = 0;
    half_inning: number = 0;
    at_bat_home: number = 0;
    at_bat_away: number = 0;
    current_balls: number = 0;
    current_strikes: number = 0;
    current_outs: number = 0;

    constructor(home_team: Team, away_team: Team, players: Object) {
        this.home_team = home_team;
        this.away_team = away_team;
        this.players = players;
    }

    simulate() {
        console.log(`Simulating game between ${this.home_team.name} and ${this.away_team.name}`);

        this.print_half_inning();
        let pitcher: Player = this.players[this.home_team.get_player_by_position(Position.Pitcher)];
        console.log(`\tPitcher: ${pitcher.name}`);
        let at_bat: Player = this.players[this.away_team.players[this.at_bat_away]];
        console.log(`\tAt bat: ${at_bat.name} ${this.current_balls}-${this.current_strikes}`);
        this.half_inning += 1;

        this.print_half_inning();
        pitcher = this.players[this.away_team.get_player_by_position(Position.Pitcher)];
        console.log(`\tPitcher: ${pitcher.name}`);
        at_bat = this.players[this.home_team.players[this.at_bat_away]];
        console.log(`\tAt bat: ${at_bat.name} ${this.current_balls}-${this.current_strikes}`);
        this.half_inning += 1;

        this.print_half_inning();
    }

    print_half_inning() {
        const inning = Math.floor(this.half_inning / 2) + 1;
        let frame = "top";
        if (this.half_inning % 2 != 0) {
            frame = "bottom";
        }
        console.log(`${frame} of the ${ordinal(inning)} ${this.score_home}-${this.score_away}-${this.current_outs}`);
    }
}

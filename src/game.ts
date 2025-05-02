import { Player, Position } from "./player";
import { random_int as rand_int } from "./random";
import { HitResult, random_hit_result } from "./result";
import { Team } from "./team";
import { ordinal } from "./util";


class GameStatistics {
    strikeouts: number = 0;
    catchouts: number = 0;
    tagouts: number = 0;
    home_runs: number = 0;
}

export class Game {
    home_team: Team;
    away_team: Team;
    half_inning: number = 0;
    at_bat_home: number = 0;
    at_bat_away: number = 0;
    current_balls: number = 0;
    current_strikes: number = 0;
    current_outs: number = 0;
    bases: Player | null [] = [null, null, null, null];
    stats: GameStatistics = new GameStatistics()

    constructor(home_team: Team, away_team: Team) {
        this.home_team = home_team;
        this.away_team = away_team;
    }

    simulate(innings: number = 9) {
        console.log(`Simulating game between ${this.home_team.name} and ${this.away_team.name}`);
        this.home_team.score = 0;
        this.away_team.score = 0;
        while (this.half_inning <= innings * 2 - 1 || this.home_team.score == this.away_team.score) {
            this.simulate_inning(this.home_team, this.away_team);
            this.simulate_inning(this.away_team, this.home_team);
        }
        console.log(`Final score: ${this.home_team.score}-${this.away_team.score}`);
        if (this.home_team.score > this.away_team.score) {
            console.log(`${this.home_team.name} win!`);
        } else {
            console.log(`${this.away_team.name} win!`);
        }
        // console.log(this.stats);
    }

    simulate_inning(batting: Team, fielding: Team) {
        const pitcher: Player = fielding.get_position_player(Position.Pitcher);
        this.print_half_inning();
        console.log(`${fielding.name} take the field! Pitcher: ${pitcher.name}`);
        console.log(`${batting.name} to bat`);
        while (this.current_outs < 3) {
            const batter: Player = batting.players[batting.at_bat % batting.players.length];
            this.simulate_at_bat(batter, batting, fielding);
            batting.at_bat += 1;
        }
        this.bases = [null, null, null, null];
        this.current_outs = 0;
        this.half_inning += 1;
    }

    simulate_at_bat(batter: Player, batting: Team, fielding: Team) {
        const pitcher: Player = fielding.get_position_player(Position.Pitcher);
        console.log(`\tAt bat: ${batter.name} (${this.home_team.score}-${this.away_team.score})`);
        this.bases[0] = batter;
        let at_bat = false;
        while (this.current_strikes < 3) {
            const result = rand_int(0, 2);
            // 0 = ball
            if (result == 0) {
                this.current_balls += 1;
                console.log(`\t\tBall ${this.current_balls}! (${this.current_balls}-${this.current_strikes}-${this.current_outs})`);
                if (this.current_balls >= 4) {
                    console.log(`\t${batter.name} walks to 1st`);
                    this.advance_bases(1, batting, false);
                    batter.stats.base_on_balls += 1;
                    break;
                }
            }
            // 1 = strike
            else if (result == 1) {
                this.current_strikes += 1;
                console.log(`\t\tStrike ${this.current_strikes}! (${this.current_balls}-${this.current_strikes}-${this.current_outs})`);
            }
            // 2 = hit
            else if (result == 2) {
                const hit_result = random_hit_result();
                if (hit_result == HitResult.HomeRun) {
                    console.log(`\t\tHOME RUN!`);
                    this.stats.home_runs += 1;
                    const rbi = this.advance_bases(4, batting, false);
                    at_bat = true;
                    batter.stats.home_runs += 1;
                    batter.stats.hits += 1;
                    batter.stats.runs_batted_in += rbi;
                    break;
                }
                else if (hit_result > HitResult.Foul) {
                    console.log(`\t\t${batter.name} hits for ${hit_result} bases`);
                    const rbi = this.advance_bases(hit_result, batting);
                    at_bat = true;
                    batter.stats.hits += 1;
                    batter.stats.runs_batted_in += rbi;
                    break;
                } else if (hit_result == HitResult.Foul) {
                    console.log(`\t\tFoul ball! (${this.current_balls}-${this.current_strikes}-${this.current_outs}`);
                    this.current_balls += 1;
                } else if (hit_result == HitResult.Out) {
                    this.current_outs += 1;
                    this.stats.catchouts += 1;
                    console.log(`\t\tThe ball is caught! ${this.current_outs} out(s)`);
                    at_bat = true;
                    break;
                } else {
                    throw new RangeError(`Invalid hit result ${hit_result}`);
                }
            }
            else {
                throw new RangeError(`Invalid batting result: ${result}`);
            }
        }
        if (this.current_strikes >= 3) {
            this.current_outs += 1;
            this.stats.strikeouts += 1;
            console.log(`\t\tSTRIKEOUT! ${this.current_outs} out(s)`);
            batter.stats.strike_outs += 1;
            at_bat = true;
        }
        batter.stats.plate_appearances += 1;
        if (at_bat) {
            batter.stats.at_bats += 1;
        }
        this.current_balls = 0;
        this.current_strikes = 0;
    }

    // Advance runners on base by `num` bases. Outs can be disabled by setting the `outs_allowed`
    // argument to `false`, such as for a 4-ball walk to 1st or an out-of-the-park home run
    advance_bases(num: number, running_team: Team, outs_allowed: boolean = true): number {
        let runs: number = 0;
        for (let i: number = 3; i >= 0; i--) {
            const player: Player = this.bases[i];
            this.bases[i] = null;
            let tagged_out = false;
            // roll for each base advanced - 0=out, all other rolls=safe
            for (let rolls: number = 0; rolls <= num - i; rolls += 1) {
                const roll = rand_int(0, 2);
                if (roll == 0) {
                    tagged_out = true;
                    break;
                }
            }
            // advance bases
            if (!player) {
                continue;
            } else if (tagged_out && outs_allowed) {
                this.current_outs += 1;
                console.log(`\t${player.name} is tagged out while running! ${this.current_outs} out(s)`);
                this.stats.tagouts += 1;
            } else if (i + num > 3) {
                console.log(`\t${player.name} reaches home!`);
                running_team.score += 1;
                player.stats.runs_scored += 1;
                runs += 1;
            } else {
                console.log(`\t${player.name} reaches ${ordinal(i + num)} base!`);
                this.bases[i + num] = player;
                // if this player was the batter, add to their TB and TOB
                if (i == 0) { player.stats.total_bases += num; }
            }
        }
        return runs;
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

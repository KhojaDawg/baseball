import { players, print_players_stats } from "./src/database";
import { Player, Position } from "./src/player";
import { Team } from "./src/team";
import { Game } from "./src/game";


const home_team: Team = new Team("Dog Pound");
home_team.add_new_player("khoja", new Player("Khoja"), Position.Pitcher);
home_team.add_player(players["andrew"], Position.Catcher);
home_team.add_player(players["adam"], Position.FirstBase);
home_team.add_player(players["dawn"], Position.SecondBase);
home_team.add_player(players["ivy"], Position.ThirdBase);
home_team.add_player(players["andrea"], Position.Shortstop);
home_team.add_player(players["liliana"], Position.CenterField);
home_team.add_player(players["mata"], Position.LeftField);
home_team.add_player(players["sean"], Position.RightField);

const away_team: Team = new Team("Gremlins");
away_team.add_player(players["eli"], Position.Pitcher);
away_team.add_player(players["jace"], Position.Catcher);
away_team.add_player(players["leah"], Position.FirstBase);
away_team.add_player(players["haley"], Position.SecondBase);
away_team.add_player(players["bea"], Position.ThirdBase);
away_team.add_player(players["florence"], Position.Shortstop);
away_team.add_player(players["munchkinbert"], Position.LeftField);
away_team.add_player(players["angela"], Position.CenterField);

const game: Game = new Game(home_team, away_team);
game.simulate();

print_players_stats();

import { Player } from "./src/player";
import { Team, Position } from "./src/team";
import { Game } from "./src/game";


const players = {
    "khoja": new Player("Khoja"),
    "andrea": new Player("Andrea"),
    "leah": new Player("Leah"),
    "jace": new Player("Jace"),
    "eli": new Player("Eli"),
};

const home_team: Team = new Team("Dog Pound");
home_team.add_player("khoja", Position.Pitcher);
home_team.add_player("andrea", Position.Shortstop);

const away_team: Team = new Team("Gremlins");
away_team.add_player("leah", Position.FirstBase);
away_team.add_player("jace", Position.Catcher);
away_team.add_player("eli", Position.Pitcher);

const game: Game = new Game(home_team, away_team, players);
game.simulate();

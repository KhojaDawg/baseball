import { Player } from "./src/player";
import { Team, Position } from "./src/team";
import { Game } from "./src/game";


const players = {
    "khoja": new Player("Khoja"),
    "andrea": new Player("Andrea"),
    "adam": new Player("Adam"),
    "andrew": new Player("Andrew"),
    "liliana": new Player("Liliana"),
    "sean": new Player("Sean"),
    "leah": new Player("Leah"),
    "jace": new Player("Jace"),
    "eli": new Player("Eli"),
    "bea": new Player("Bea"),
    "haley": new Player("Haley"),
    "florence": new Player("Florence"),
    "dawn": new Player("Dawn"),
    "ivy": new Player("Ivy"),
    "mata": new Player("Mata"),
    "munchkinbert": new Player("Munchkinbert"),
};

const home_team: Team = new Team("Dog Pound");
home_team.add_player("khoja", Position.Pitcher);
home_team.add_player("andrew", Position.Catcher);
home_team.add_player("adam", Position.FirstBase);
home_team.add_player("dawn", Position.SecondBase);
home_team.add_player("ivy", Position.ThirdBase);
home_team.add_player("andrea", Position.Shortstop);
home_team.add_player("liliana", Position.CenterField);
home_team.add_player("mata", Position.LeftField);
home_team.add_player("sean", Position.RightField);

const away_team: Team = new Team("Gremlins");
away_team.add_player("eli", Position.Pitcher);
away_team.add_player("jace", Position.Catcher);
away_team.add_player("leah", Position.FirstBase);
away_team.add_player("haley", Position.SecondBase);
away_team.add_player("bea", Position.ThirdBase);
away_team.add_player("florence", Position.Shortstop);
away_team.add_player("munchkinbert", Position.LeftField);

const game: Game = new Game(home_team, away_team, players);
game.simulate();

console.log(players);

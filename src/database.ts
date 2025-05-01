import { Player, PlayerHandle } from "./player";


export interface PlayerList {
    [index: PlayerHandle]: Player
};

export const players: PlayerList = {
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
    "angela": new Player("Angela"),
};

export function print_players_stats() {
    const table_data = []
    for (const handle in players) {
        const player: Player = players[handle];
        const identifier = player.name + " (#" + player.jersey_number + ")";
        table_data[identifier] = {
            "Team": player.team.name,
            "BA": player.stats.batting_average().toFixed(3),
            "SLG": String(Math.round(player.stats.slugging_percentage())) + "%",
            "H": player.stats.hits, "AB": player.stats.at_bats, "RBI": player.stats.runs_batted_in,
            "R": player.stats.runs_scored, "K": player.stats.strike_outs,
            "TB": player.stats.total_bases, "TOB": player.stats.times_on_base(),
        };
    }
    console.table(table_data);
}

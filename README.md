# Discord-Baseball

Discord bot that allows you to simulate baseball games amongst the members of a Discord server. Add the bot to your server, create teams, register yourself to one of the teams, and simulate games with the bot providing play-by-play in a thread.

## Getting Started

### For Players

With the bot running on your Discord server, type the command `/players register` and press Enter to register yourself as a player in your server's virtual Discord baseball league. You can provide a few additional pieces of data to the register command such as the position to play and the team to join, but these can be omitted and edited later.

You need two teams with a full roster of players in order to simulate a game, however not every player needs to be a discord user if your server does not have enough users for two full teams. The `/players create` command can be used to create players not associated with a discord user, or the `/teams fill` command can be used to fill all empty slots in teams with randomly generated players.

Once you have two full teams, you can now simulate a game using the `/game simulate` command. You will be prompted to enter which team should be the home and away team for this game (**NOTE:** this IS case-sensitive). You may also optionally specify a number of innings to play, otherwise the game will default to 9. If both teams exist on the server and both have full player rosters, the bot will create a new thread for this game and provide a play-by-play within the thread to keep from cluttering whatever channel the game was started in.

For a full list of commands and their usage, send the `/help` command to the bot or see the [Full Command List section](#full-command-list) of this readme.

### For Bot Hosts

Guide on how to host your own baseball bot for your server:

1. Clone or download the repository and install your NodeJS package manager of choice (the project was made with NPM). Install project dependencies with said package manager. Ensure TypeScript is also installed.

2. Go to [the Discord Developers' site](https://discord.com/developers/) and create a new application. Set up the application following Discord's instructions, and obtain your application's APP ID, Public Key, and token.

3. Create a new file `.env` at the root of your Discord baseball directory with the following contents:

    ```
    APP_ID=1234567890123456789
    PUBLIC_KEY=Y3VhbmRvIHTDuiBtZSBiZXNhcyBtZSBzaWVudG8gZW4gZWwgYWlyZSBwb3IgZXNv
    TOKEN=Y3VhbmRvIHRlIHZlbyBjb21pZW56byBhIGJlc2FydGUgeSBzaSB0ZSBkZXNwZWdhcyB5by
	# GUILD_ID=123456789012345678 # Optional
    DB_USER=USERNAME
    DB_PASSWORD=PASSWORD
    ```

	Replace the value for `APP_ID` with your Discord application ID, `PUBLIC_KEY` with your application's public key, and `TOKEN` with its token. Additionally, a username and password for the database can be provided with `DB_USER` and `DB_PASSWORD` respectively. The optional `GUILD_ID` field can be ignored, and is explained in step 5.

4. With TypeScript installed, run `tsc` to compile the project, which will create JavaScript files in the `/build` directory.

5. Run the compiled `/build/deploy-commands.js` to deploy the commands to your Discord application, allowing Discord to read commands sent by users and send them to your bot. Running this as is will update the commands for all of Discord, but will usually take some time before the changes actually reflect on Discord. However, if you uncomment the `GUILD_ID` line in the `.env` file and provide it with the ID of the Discord server you wish to test the bot on, running `/build/deploy-commands.js` will update commands only for that server. The commands will only be updated for that specific server, but they will show in Discord much quicker.

6. Run `/build/index.js` to run the bot itself. If command deployment has finished on Discord's end and everything else is set up correctly, you should now be able to issue commands on any server your baseball bot has been added to.

## Comprehensive Commands Guide

All Discord slash commands used by this bot consist of three parts:

```
/<command> <subcommand> <options>
```

`<command>` is the main command that determines generally what you're manipulating, such as a team or a player. `<subcommand>` tells the bot what action you're taking such as creating or editing a team of player. `<options>` is where you can specify some additional information for the command to tell it how to do its job. For example, to create a new team called "Foobar", you can run the following slash command:

```
/teams create team_name Foobar
```

The main command is `teams` which tells the bot you're taking some action to do with teams, the subcommand `create` tells the bot that you wish to create a new team, and the `team_name` option allows you to provide a name for your newly created team.

You can run the command `/help` to get a list of all main commands and what they're for, as well as use a `help` subcommand for any of the main commands for help with that subcommand specifically. For example, `/players help` will provide you with a list of all subcommands for the `players` command and their usage.

### Full Command List

Top level items are commands, bulleted lists contain subcommands with their options. An option name that begins with a `?` character is optional and does not need to be provided.

#### `players`

Commands for getting or manipulating player data

* `register <?team> <?position>` register yourself as a player in your discord server league. You can optionally specify a team by its name or UUID (case sensitive) and a position to play.
* `get <target>` returns detailed information on the target player. Player can be specified by name (case-sensitive exact match) or UUID
* `list <?team>` list players on the given team if a team name or UUID is provided, otherwise lists all players in your discord server league
* `edit <player> <?name> <?team> <?position>` edits the details of the given player. Player is selected by name or UUID (must be an exact case-sensitive match). Currently you can change a player's name, team, or fielding position. Multiple values can be updated at once.

#### `teams`

Commands for getting or manipulating team data

* `create <name>` creates a new team with the given name
* `get <team>` returns detailed information about a specific team. Team can be specified by name (case-sensitive) or UUID
* `edit <team> <?name>` updates the specified team with the given information. Team can be specified by name (case-sensitive) or UUID.
* `list` returns a list of all the teams in the server with their UUIDs
* `fill <?team>` fills any empty positions on the given team with randomly generated players, or if no team is specified fills all teams in your server's league

#### `game`

Commands for simulating games

* `simulate <home_team> <away_team>` simulate one game between the given two teams. Teams can be specified by name (case-sensitive) or UUID 

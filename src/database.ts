import "dotenv/config";
import {
	Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes,
	BelongsToSetAssociationMixin, HasManyAddAssociationMixin, HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyAddAssociationsMixin,
	BelongsToGetAssociationMixin,
	HasManyRemoveAssociationMixin,
} from "sequelize";
import { random as rand } from "./util";


export const sequelize = new Sequelize("database", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});


export enum Position {
    Pitcher = "pitcher",
    Catcher = "catcher",
    FirstBase = "first_base",
    SecondBase = "second_base",
    ThirdBase = "third_base",
    Shortstop = "shortstop",
    LeftField = "left_field",
    CenterField = "center_field",
    RightField = "right_field",
}

// Returns an iterable array of all possible positions. Used for enumeration
export function all_positions(): Position[] {
	return [
		Position.Pitcher, Position.Catcher,
		Position.FirstBase, Position.SecondBase, Position.ThirdBase, Position.Shortstop,
		Position.LeftField, Position.CenterField, Position.RightField
	];
}


export class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
	declare uuid: string;
	declare guild: string;
	declare name: string;
	declare discord_user: string | null;
	declare position: Position | null;

	declare getTeam: BelongsToGetAssociationMixin<Team>;
	declare setTeam: BelongsToSetAssociationMixin<Team, string>;
};
Player.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			unique: true,
			allowNull: false,
			primaryKey: true,
		},
		guild: {
			type: DataTypes.STRING,
			defaultValue: "",
			unique: false,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		discord_user: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
		},
		position: {
			type: DataTypes.ENUM,
			values: [
				Position.Pitcher, Position.Catcher,
				Position.FirstBase, Position.SecondBase, Position.ThirdBase, Position.Shortstop,
				Position.LeftField, Position.CenterField, Position.RightField,
			],
			allowNull: true,
			defaultValue: null,
		}
	},
	{ sequelize: sequelize, freezeTableName: true },
);


export class Team extends Model<InferAttributes<Team>, InferCreationAttributes<Team>> {
	declare uuid: string;
	declare guild: string;
	declare name: string;
	declare at_bat: number;

	declare addPlayer: HasManyAddAssociationMixin<Player, string>;
	declare addPlayers: HasManyAddAssociationsMixin<Player, string>;
	declare getPlayers: HasManyGetAssociationsMixin<Player>;
	declare hasPlayer: HasManyHasAssociationMixin<Player, string>;
	declare removePlayer: HasManyRemoveAssociationMixin<Player, string>;
}
Team.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			unique: true,
			allowNull: false,
			primaryKey: true,
		},
		guild: {
			type: DataTypes.STRING,
			defaultValue: "",
			unique: false,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			defaultValue: "",
			allowNull: false,
		},
		at_bat: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{ sequelize: sequelize, freezeTableName: true },
);


export class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
	declare uuid: string;
	declare guild: string;
	declare home_team_uuid: string;
	declare away_team_uuid: string;
	declare home_score: number;
	declare away_score: number;
	declare half_inning: number;
	declare balls: number;
	declare strikes: number;
	declare outs: number;

	inning(): number {
		return Math.trunc(this.half_inning / 2) + 1;
	}

	inning_ordinal(): string {
		const inning = this.inning();
		if (inning == 1) return `${inning}st`;
		else if (inning == 2) return `${inning}nd`;
		else if (inning == 3) return `${inning}rd`;
		else return `${inning}th`;
	}

	inning_name(): string {
		return `${this.half_inning_name()} of the ${this.inning_ordinal()}`;
	}

	is_inning_top(): boolean {
		if (this.half_inning % 2 == 0) return true;
		else return false;
	}

	is_inning_bottom(): boolean {
		return !this.is_inning_top()
	}

	half_inning_name(): string {
		if (this.is_inning_top()) {
			return "Top";
		} else {
			return "Bottom";
		}
	}

	score_run(team_uuid: string) {
		if (team_uuid === this.home_team_uuid) this.home_score += 1;
		else if (team_uuid === this.away_team_uuid) this.away_score += 1;
		else throw new Error(`UUID ${team_uuid} does not belong to either team in this game`);
	}
}
Game.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			unique: true,
			allowNull: false,
			primaryKey: true,
		},
		guild: {
			type: DataTypes.STRING,
			defaultValue: "",
			unique: false,
			allowNull: false,
		},
		home_team_uuid: {
			type: DataTypes.STRING,
			defaultValue: "",
			allowNull: false,
		},
		away_team_uuid: {
			type: DataTypes.STRING,
			defaultValue: "",
			allowNull: false,
		},
		home_score: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		away_score: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		half_inning: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		balls: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		strikes: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		outs: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		}
	},
	{ sequelize }
);


Team.hasMany(Player, { onUpdate: "CASCADE", onDelete: "SET NULL" });
Player.belongsTo(Team, { onUpdate: "CASCADE", onDelete: "SET NULL" });


export function createRandomPlayer(position: Position, guild: string): Promise<Player> {
	return Player.create({ name: rand.random_name(), position: position, guild: guild });
}

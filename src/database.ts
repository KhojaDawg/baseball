import "dotenv/config";
import {
	Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes,
	BelongsToSetAssociationMixin, HasManyAddAssociationMixin, HasManyGetAssociationsMixin,
} from "sequelize";


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


export class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
	declare uuid: string;
	declare guild: string;
	declare name: string;
	declare discord_user: string | null;
	declare position: Position | null;

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
	declare getPlayers: HasManyGetAssociationsMixin<Player>;
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

Team.hasMany(Player, { onUpdate: "CASCADE", onDelete: "SET NULL" });
Player.belongsTo(Team, { onUpdate: "CASCADE", onDelete: "SET NULL" });

import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";
import { Player, PlayerHandle } from "./player";


export const sequelize = new Sequelize("database", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});

export const Teams = sequelize.define("teams", {
	uuid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		unique: true,
		allowNull: false,
		primaryKey: true,
	},
	guild: {
		type: DataTypes.STRING,
		unique: false,
		defaultValue: "",
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export const Players = sequelize.define("players", {
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
	},
});

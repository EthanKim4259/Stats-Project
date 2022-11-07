const pg = require("pg");
const {Sequelize, Model, DataTypes} = require("sequelize");

class DbWrapper {
	constructor(url) {
		this.sequelize = new Sequelize(url, {dialectModule: pg});
		
		this.Response = this.sequelize.define("response", {
			type: DataTypes.INTEGER,
			hours: DataTypes.FLOAT,
			classes: DataTypes.INTEGER,
			difficulty: DataTypes.FLOAT
		});

		(async () => {
			await this.sequelize.sync({alter: true});
		})();
	}

	static assertType(type) {
		if (type == NaN) return false;
		if (type != 1 && type != 0) return false;
		return true;
	}

	static assertHours(hours) {
		if (hours == NaN) return false;
		if (hours % 1 != 0.5 && hours % 1 != 0.0) return false;
		if (hours < 0 || hours > 12) return false;
		return true;
	}

	static assertClasses(classes) {
		if (classes == NaN) return false;
		if (classes % 1 != 0) return false;
		if (classes < 0 || classes > 7) return false;
		return true;
	}

	static assertDifficulty(difficulty) {
		if (difficulty == NaN) return false;
		if (difficulty % 1 != 0.5 && difficulty % 1 != 0.0) return false;
		if (difficulty < 1 || difficulty > 10) return false;
		return true;
	}

	async addData(type, hours, classes, difficulty) {
		if (!DbWrapper.assertType(parseInt(type))) throw "Invalid type";
		if (!DbWrapper.assertHours(parseInt(hours))) throw "Invalid hours";
		if (!DbWrapper.assertClasses(parseInt(classes))) throw "Invalid classes";
		if (!DbWrapper.assertDifficulty(parseInt(classes))) throw "Invalid difficulty";
		
		const response = await this.Response.create({type, hours, classes, difficulty})
			.catch(console.error);
		return response;
	}
};

module.exports = {DbWrapper};
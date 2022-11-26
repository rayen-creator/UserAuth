const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB, config.USER, config.PASSWORD, {
        host: config.HOST,
        port: '3307', //-------------> change port here

        dialect: config.dialect,
        operatorsAliases: false,

    });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.js")(sequelize, Sequelize);

module.exports = db;
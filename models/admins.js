const sequelize = require("../connections/database");
const Sequelize = require("sequelize");

const Admins = sequelize.define("admin", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
})

module.exports = Admins;
const Sequelize = require("sequelize");
const sequelize = require("../connections/database");

const Groups = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    members: {
        type: Sequelize.INTEGER
    },
    createdBy: {
        type: Sequelize.STRING
    }
})

module.exports = Groups;
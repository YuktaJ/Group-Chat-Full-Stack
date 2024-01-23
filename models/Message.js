const Sequelize = require("sequelize");
const sequelize = require("../connections/database");

const Message = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Message;
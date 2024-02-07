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
    },
    isImage: {
        type: Sequelize.BOOLEAN
    },
    url: {
        type: Sequelize.STRING
    },
    isVideo: {
        type: Sequelize.BOOLEAN
    },
    isDocument: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = Message;
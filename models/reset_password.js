const sequelize = require("../connections/database");
const Sequelize = require("sequelize");

const ForgotPassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = ForgotPassword;
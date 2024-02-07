const Sequelize = require("sequelize").Sequelize;
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST
})

module.exports = sequelize;
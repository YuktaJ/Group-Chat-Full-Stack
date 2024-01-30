const env = require("dotenv");
env.config();

const express = require("express");
const sequelize = require("./connections/database");

const cors = require("cors");

const userRoutes = require("./routes/User");
const User = require("./models/User");
const messageRoutes = require("./routes/Message.js");
const Message = require("./models/Message");
const Groups = require('./models/Groups.js');


const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRoutes);
app.use(messageRoutes);


User.hasMany(Message);

Groups.belongsToMany(User, { through: "Users_Group" });
User.belongsToMany(Groups, { through: "Users_Group" });

Groups.hasMany(Message);
async function main() {
    try {
        await sequelize.sync();
        app.listen(3000);
        console.log("Connection Done!");
    } catch (error) {
        console.log(error);
    }
}

main();
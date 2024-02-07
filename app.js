const env = require("dotenv");
env.config();

const express = require("express");
const sequelize = require("./connections/database");

const path = require("path");

const { Server } = require("socket.io");
const { createServer } = require("http");
const websocketService = require("./services/web-socket.js");
const cors = require("cors");

const userRoutes = require("./routes/users.js");
const User = require("./models/users.js");
const messageRoutes = require("./routes/messages.js");
const Message = require("./models/messages.js");
const Groups = require('./models/groups.js');
const ForgotPassword = require("./models/reset_password.js");
const Admins = require("./models/admins.js");


const app = express();

app.use(cors({
    origin: "*",
}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRoutes);
app.use(messageRoutes);
app.use((req, res) => {
    res.sendFile(path.join(__dirname, `${req.url}`));
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});
io.on("connection", websocketService);

User.hasMany(Message);
User.hasMany(Admins);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

Groups.belongsToMany(User, { through: "Users_Group" });
User.belongsToMany(Groups, { through: "Users_Group" });

Groups.hasMany(Message);
Groups.hasMany(Admins);


async function main() {
    try {
        await sequelize.sync();
        httpServer.listen(3000);
        console.log("Connection Done!");
    } catch (error) {
        console.log(error);
    }
}

main();
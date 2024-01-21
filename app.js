const env = require("dotenv");
env.config();

const express = require("express");
const sequelize = require("./connections/database");

const cors = require("cors");

const userRoutes = require("./routes/User");
const User = require("./models/User");



const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRoutes);

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
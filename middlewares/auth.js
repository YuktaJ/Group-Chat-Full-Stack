const User = require("../models/users");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("token");
        console.log(token);
        const user = jwt.verify(token, process.env.SECRETKEY); //token correct hai ki nahi
        console.log(user);
        if (!user) {
            throw new Error("INVALID USER");
        } else {
            const u = await User.findByPk(user.id);
            req.user = u;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Something went wrong"

        })

    }
}

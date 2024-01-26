const User = require("../models/User");

const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("token");
        const user = jwt.verify(token, "SecretYukta"); //token correct hai ki nahi 
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

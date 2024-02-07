const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const sequelize = require("../connections/database");

exports.postSignUp = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const name = req.body.name;
        const password = req.body.password;
        const phone = req.body.phone;
        const email = req.body.email;

        console.log("Yeh name hai ", name)
        let user = await User.findOne({
            where: {
                email
            }
        })

        if (user) {
            await t.rollback();
            return res.status(404).json({
                message: "User Already Exist."
            })
        }
        const saltrounds = 10;
        const hash = await bcrypt.hash(password, saltrounds); // Hash the password synchronously

        await User.create({
            name,
            email,
            phone,
            password: hash
        }, { transaction: t });

        await t.commit();

        return res.status(201).json({
            message: "User created successfully."
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: "User creation failed."
        });
    }
}

exports.generateAccessToken = (id, name) => {
    return jwt.sign({ id, name }, process.env.SECRETKEY);
}

exports.postLogin = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        let email = req.body.email;
        let password = req.body.password;

        let user = await User.findOne({
            where: {
                email
            },
            transaction: t
        });

        if (!user) {
            return res.status(404).json({
                message: "User doesn't exists.",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect Password",
                success: false
            });
        } else {
            await t.commit();
            return res.status(201).json({
                token: exports.generateAccessToken(user.id, user.name),
                message: "User logged in successfully",
                success: true
            })
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: "Login Failed."
        })
    }
}
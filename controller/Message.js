const Message = require("../models/Message");
const User = require("../models/User");
const { Op } = require("sequelize");

exports.postAddMessage = async (req, res) => {
    try {
        let message = req.body.message;
        if (!message) {
            return res.status(404).json({
                message: "Kuch nahi likha"
            })
        }
        let text = await Message.create({
            text: message,
            userId: req.user.id
        })
        res.status(201).json({
            text: text,
            userId: req.user.id,
            message: "Message sent."
        })
    } catch (error) {
        alert("Error in sending the message.");
        res.status(401).json({
            error: "No message sent."
        })
    }
}

exports.getMessage = async (req, res) => {
    try {
        let lastId = req.query.lastId;
        if (lastId == undefined || lastId == null || lastId == NaN) {
            lastId = "0";
        }

        lastId = Number.parseInt(lastId);
        console.log(lastId);
        let users = await User.findAll(); //array 
        let message = await Message.findAll({
            where: {
                id: {
                    [Op.gt]: lastId
                }
            }
        });//array
        res.status(201).json({
            users: users, //array 
            message: message //array
        });
    } catch (error) {
        res.status(500).json({
            error: "Couldn't fetch messages."
        })
    }
}

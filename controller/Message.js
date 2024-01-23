const Message = require("../models/Message");

exports.postAddMessage = async (req, res) => {
    try {
        let message = req.body.message;
        let text = await Message.create({
            text: message
        })
        res.status(201).json({
            text: text,
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
        let message = await Message.findAll();
        res.status(201).json({
            message: message
        });
    } catch (error) {
        res.status(500).json({
            error: "Couldn't fetch messages."
        })
    }
}

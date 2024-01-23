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
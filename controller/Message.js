const Message = require("../models/Message");
const User = require("../models/User");
const { Op } = require("sequelize");
const Groups = require("../models/Groups");


exports.postAddMessage = async (req, res) => {
    try {
        let message = req.body.message;
        let groupId = req.body.groupId;
        if (!message) {
            return res.status(404).json({
                message: "Kuch nahi likha"
            })
        }
        let text = await Message.create({
            text: message,
            userId: req.user.id,
            groupId
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
        let groupId = req.query.groupId;
        if (lastId == undefined || lastId == null || lastId == NaN) {
            lastId = "0";
        }

        if (groupId == undefined || groupId == null || groupId == NaN) {
            return res.status(404).json({
                Error: "NO GROUP SELECTED"
            });
        }
        lastId = Number.parseInt(lastId);
        

        let users = await User.findAll(); //array 
        let message = await Message.findAll({
            where: {
                id: {
                    [Op.gt]: lastId
                },
                groupId: groupId
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

exports.groupusers = async (req, res) => {
    try {
        let users = await User.findAll();
        res.status(200).json({
            users: users
        })
    } catch (error) {
        res.status(404).json({
            error: "Something went wrong"
        })
    }
}

exports.groupdetails = async (req, res) => {
    let members = 0;
    try {
        let arr = req.body.Ele;
        let groupname = req.body.name;
        console.log("Working1")
        let group = await Groups.create({
            name: groupname,
            createdBy: req.user.name,
        })
        console.log("Working2")
        //Adding the Admin to the group
        await group.addUser(req.user);
        members++;
        await group.update({
            members: members
        });
        console.log("Working3")
        //Adding the members to the group
        for (let i = 0; i < arr.length; i++) {
            let id = Number.parseInt(arr[i]);
            let user = await User.findByPk(id);
            await group.addUser(user);
            members++;
            await group.update({
                members: members
            });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.groupnames = async (req, res, next) => {
    try {

        let groupnames = await req.user.getGroups();

        res.status(200).json({
            groupnames: groupnames
        })
    } catch (error) {
        console.log(error);
    }
}
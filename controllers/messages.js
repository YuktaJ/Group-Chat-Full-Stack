const Message = require("../models/Message");
const User = require("../models/User");
const { Op, Model } = require("sequelize");
const Groups = require("../models/Groups");
const Admins = require("../models/Admins");

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
        await Admins.create({
            userId: req.user.id,
            groupId: group.id
        })
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
        let admins = await req.user.getAdmins();

        res.status(200).json({
            groupnames: groupnames,
            admins: admins
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getGroupMembers = async (req, res) => {
    try {
        let groupid = req.query.groupid;
        let group = await Groups.findByPk(groupid);
        let groupMembers = await group.getUsers();
        res.status(200).json({
            groupMembers
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getAdmins = async (req, res) => {
    try {
        let admins = await Admins.findAll({
            where: {
                groupId: req.query.groupid
            }
        });
        res.status(200).json({
            admins
        })
    } catch (error) {
        console.log(error);
    }
}

exports.editDetails = async (req, res) => {
    try {
        let group_id = req.query.data;
        let adminUsers = await User.findAll({
            include: [
                {
                    model: Admins,
                    where: {
                        groupId: group_id
                    }
                }
            ]
        })

        let group = await Groups.findByPk(group_id);
        let users = await group.getUsers();
        let groupUsers = users.filter((user) => {
            //filtering array in a array
            return !adminUsers.some((adminUser) => adminUser.id == user.id);
        })

        //rest of the users
        let arr = await User.findAll();
        let otherUsers = arr.filter((usr) => {
            return !users.some((user) => user.id == usr.id);
        })

        res.status(202).json({
            adminUsers,
            groupUsers,
            otherUsers
        })

    } catch (error) {
        console.log(error);
    }
}

exports.removeUser = async (req, res) => {
    try {
        let id = req.body.id;
        let groupid = req.body.groupid;
        let user = await User.findByPk(id);
        let group = await Groups.findByPk(groupid);
        await group.removeUser(user);
        res.status(200).json({
            message: "User removed successfully."
        })
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
}

exports.removeAdmin = async (req, res) => {
    try {
        let id = req.body.id;
        let groupid = req.body.groupid;
        await Admins.destroy(
            {
                where: {
                    groupId: groupid,
                    userId: id
                }
            }
        )
        res.status(200).json({
            message: "Admin removed successfully."
        })

    } catch (error) {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
}

exports.addAdmin = async (req, res) => {
    try {
        let id = req.body.id;
        let groupid = req.body.groupid;
        await Admins.create({
            groupId: groupid,
            userId: id
        })
        res.status(200).json({
            message: "User added as admin successfully."
        })
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
}

exports.addUser = async (req, res) => {
    try {
        let id = req.body.id;
        let groupid = req.body.groupid;
        let user = await User.findByPk(id);
        let group = await Groups.findByPk(groupid);
        await group.addUser(user);
        res.status(200).json({
            message: "User added successfully."
        })
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong."
        })
    }
}

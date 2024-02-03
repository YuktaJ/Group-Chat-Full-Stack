let express = require("express");
let router = express.Router();

let messageController = require("../controllers/messages");
let authController = require("../middlewares/auth");

router.post("/message", authController.authenticate, messageController.postAddMessage);
router.get("/message", authController.authenticate, messageController.getMessage);
router.get("/group-users", messageController.groupusers);
router.post("/group-details", authController.authenticate, messageController.groupdetails);
router.get("/group-names", authController.authenticate, messageController.groupnames);
router.get("/group-members", messageController.getGroupMembers);
router.get("/get-admins", messageController.getAdmins)
router.get("/edit_details", messageController.editDetails);
router.post("/remove-user", messageController.removeUser);
router.post("/remove-admin", messageController.removeAdmin);
router.post("/add-admin", messageController.addAdmin);
router.post("/add-user", messageController.addUser);
module.exports = router;

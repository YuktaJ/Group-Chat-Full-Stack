let express = require("express");
let router = express.Router();

let messageController = require("../controller/Message");
let authController = require("../middleware/auth");

router.post("/message", authController.authenticate, messageController.postAddMessage);
router.get("/message", authController.authenticate, messageController.getMessage);
router.get("/groupusers", messageController.groupusers);
router.post("/groupdetails", authController.authenticate, messageController.groupdetails);
router.get("/groupnames",authController.authenticate,messageController.groupnames);
module.exports = router;

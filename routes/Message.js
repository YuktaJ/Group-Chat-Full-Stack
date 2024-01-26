let express = require("express");
let router = express.Router();

let messageController = require("../controller/Message");
let authController = require("../middleware/auth");

router.post("/message", authController.authenticate, messageController.postAddMessage);
router.get("/message", authController.authenticate, messageController.getMessage);
module.exports = router;
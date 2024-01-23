let express = require("express");
let router = express.Router();

let messageController = require("../controller/Message");

router.post("/message", messageController.postAddMessage);

module.exports = router;
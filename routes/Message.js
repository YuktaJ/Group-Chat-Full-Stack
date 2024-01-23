let express = require("express");
let router = express.Router();

let messageController = require("../controller/Message");

router.post("/message", messageController.postAddMessage);
router.get("/message",messageController.getMessage);
module.exports = router;
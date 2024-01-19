let express = require("express");
let router = express.Router();
let userController = require("../controller/User")

router.post("/signup", userController.postSignUp);

module.exports = router;
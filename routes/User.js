let express = require("express");
let router = express.Router();
let userController = require("../controllers/User");


router.post("/signup", userController.postSignUp);
router.post("/login", userController.postLogin);

module.exports = router;
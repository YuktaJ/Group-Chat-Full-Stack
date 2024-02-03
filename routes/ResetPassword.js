const express = require("express");

const router = express.Router();
const resetPasswordController = require("../controllers/ResetPassword")

router.post("/resetPassword", resetPasswordController.resetPassword);
router.use("/updatepassword/:resetpasswordid", resetPasswordController.updatePassword);
router.get("/resetpassword/:id", resetPasswordController.getResetPassword);


module.exports = router;
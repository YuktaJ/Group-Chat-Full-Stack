const express = require("express");

const router = express.Router();
const resetPasswordController = require("../controllers/reset_password")

router.post("/reset-password", resetPasswordController.resetPassword);
router.use("/update-password/:resetpasswordid", resetPasswordController.updatePassword);
router.get("/reset-password/:id", resetPasswordController.getResetPassword);


module.exports = router;
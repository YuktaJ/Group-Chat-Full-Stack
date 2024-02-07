const express = require("express");
const multer = require("multer");
const router = express.Router();



const messageController = require("../controllers/messages");
const authController = require("../middlewares/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post("/messages", authController.authenticate, messageController.postAddMessage);
router.get("/messages", authController.authenticate, messageController.getMessage);
router.get("/group-users", messageController.groupUsers);
router.post("/group-details", authController.authenticate, messageController.groupDetails);
router.get("/group-names", authController.authenticate, messageController.groupNames);
router.get("/group-members", messageController.getGroupMembers);
router.get("/get-admins", messageController.getAdmins)
router.get("/edit_details", messageController.editDetails);
router.post("/remove-user", messageController.removeUser);
router.post("/remove-admin", messageController.removeAdmin);
router.post("/add-admin", messageController.addAdmin);
router.post("/add-user", messageController.addUser);
router.post("/upload-files", upload.single("file"), authController.authenticate, messageController.uploadFiles);

module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const StudentController = require("../controllers/StudentController");
router.post(
    "/create",
    upload.single("resume"),
    StudentController.createProfile
);

module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const PCellController = require("../controllers/PCellController");
router.post("/create", PCellController.createProfile);
router.get("/students", PCellController.getStudents);
router.get("/jobs", PCellController.getJobPosts);
router.post("/toggleBan", PCellController.toggleBan);
module.exports = router;

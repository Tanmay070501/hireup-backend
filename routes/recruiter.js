const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const RecruiterController = require("../controllers/RecruiterController");
router.post("/create", RecruiterController.createProfile);
router.post("/job/create", RecruiterController.createJobPost);
router.get("/jobs", RecruiterController.getJobPostList);
router.get("/job/applicants/:jobId", RecruiterController.getApplicantsList)
router.delete("/job/:jobId", RecruiterController.jobDelete)
module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const StudentController = require("../controllers/StudentController");
router.post(
    "/create",
    upload.single("resume"),
    StudentController.createProfile
);
router.patch(
    "/update",
    upload.single("resume"),
    StudentController.updateProfile
);
router.put("/apply", StudentController.applyForJob);
router.get("/offcampus", StudentController.offCampusJobs);
router.get("/oncampus", StudentController.onCampusJobs);
router.get("/applied", StudentController.appliedJobs);

module.exports = router;

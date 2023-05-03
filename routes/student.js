const router = require("express").Router();
const StudentController = require("../controllers/StudentController");
router.post("/create", StudentController.createProfile);

module.exports = router;

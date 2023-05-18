const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const CompanyController = require("../controllers/CompanyController");
router.post("/invite", CompanyController.invite);
router.post("/create", upload.single("logo"), CompanyController.createProfile);
module.exports = router;

const router = require("express").Router();
const CompanyController = require("../controllers/CompanyController");
router.post("/invite", CompanyController.invite);

module.exports = router;

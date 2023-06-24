const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const AdminController = require("../controllers/AdminController");

router.get("/users", AdminController.users);
router.post("/toggleBan", AdminController.toggleBan);
router.get("/approvalList/company", AdminController.CompanyApprovalList);
router.get("/approvalList/pcell", AdminController.PcellApprovalList);
router.post("/approve", AdminController.Approve);
module.exports = router;

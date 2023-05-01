const router = require('express').Router();
const AuthController = require('../controllers/AuthController');

router.post("/signup",AuthController.signup);
router.post("/login",AuthController.login);
router.get("/verify/:id/:token", AuthController.verify)

module.exports = router;
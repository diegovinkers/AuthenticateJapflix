const express = require("express");
const authController = require('../controllers/authController')
const isAuthenticated = require('../middlewares/authMiddleware')

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login); 
router.get('/logout', authController.logout);

router.get("/searcher", isAuthenticated, (req, res) => {
    res.render("searcher");
});


module.exports = router;

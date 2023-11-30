const express = require("express");
const isAuthenticated = require('../middlewares/authMiddleware');


const router = express.Router()

router.get("/", (req, res) => {
    res.render("index", { user: res.locals.user });
});


router.get("/register", (req, res) => {
    res.render("register")
});

router.get("/login", (req, res) => {
    res.render("login")
});

router.get("/searcher", isAuthenticated, (req, res) => {
    res.render("searcher");
  });



module.exports = router;

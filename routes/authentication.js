const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.get("/login", (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  } else return res.render("login", { layout: false });
});

router.post("/login", usersController.login);

router.get("/signup", (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  else return res.render("signup", { layout: false });
});

//Temporary. (just for mvp)
router.post(
  "/signup",
  usersController.checkDuplicate,
  usersController.createUser,
  (req, res) => {
    req.session.user = res.locals.user;
    req.session.isLoggedIn = true;
    return res.redirect("/");
  }
);

router.get("/logout", usersController.logout);

module.exports = router;

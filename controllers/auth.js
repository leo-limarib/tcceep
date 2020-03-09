exports.authCoordinator = (req, res, next) => {
  if (req.session.user != undefined) {
    if (req.session.user["level"] == 3) {
      return next();
    } else return res.redirect("/");
  } else return res.redirect("/");
};

exports.authTeacher = (req, res, next) => {
  if (req.session.user != undefined) {
    if (req.session.user["level"] == 2) {
      return next();
    } else return res.redirect("/");
  } else return res.redirect("/");
};

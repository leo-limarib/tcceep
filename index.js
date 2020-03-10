const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoConnect = require("./config/database").mongoConnect;
const path = require("path");
const app = express();
require("dotenv").config();
const authController = require("./controllers/auth");

const store = new MongoDBStore({
  uri: process.env.HOST + process.env.DATABASE_NAME,
  collection: "sessions"
});

//Set the view engine to use handlebars
app.engine("handlebars", expressHbs());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "views"));

//Routes
const auth = require("./routes/authentication");
const coordinator = require("./routes/coordinator");
const teacher = require("./routes/teacher");
const student = require("./routes/student");

//Parse url parameters and jsons
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Sessions storage
app.use(
  session({
    secret: "EEP@TCC!",
    store: store,
    resave: false,
    saveUninitialized: false,
    unset: "destroy"
  })
);

//Static files (css, js)
app.use(express.static(path.join(__dirname, "public")));

//Use routes
app.use("/auth", auth);
app.use("/coordinator", authController.authCoordinator, coordinator);
app.use("/teacher", authController.authTeacher, teacher);
app.use("/student", authController.authStudent, student);

app.use("/", (req, res) => {
  return res.render("index", { layout: false, logged: req.session.isLoggedIn });
});

mongoConnect(() => {
  app.listen(80);
});

const express = require("express");
const router = express.Router();
const subjectsController = require("../controllers/subjects");
const usersController = require("../controllers/users");
const validationController = require("../controllers/validation");

router.get("/", (req, res) => {
  return res.render("coordinator", {
    layout: false,
    name: req.session.user["name"],
  });
});

// SUBJECTS //
router.get("/subjects", subjectsController.getSubjectsFromCampus);

router.post(
  "/add-subject",
  validationController.validateId("teacherId"),
  subjectsController.addSubject
);

router.get("/subject/info", subjectsController.getSubjectInfo);

router.post(
  "/add-student/:subjectId",
  validationController.validateId("subjectId"),
  validationController.validateId("studentId"),
  subjectsController.addStudent
);
// -------- //

// TEACHERS //
router.get("/teachers", usersController.getTeachersFromCampus);

router.get("/teacher/:teacherId", usersController.getTeacherInfo);

router.post(
  "/add-teacher",
  usersController.checkDuplicate,
  validationController.validateName("name"),
  validationController.validatePassword("password", "confPassword"),
  validationController.validateEmail("email"),
  usersController.createTeacher
);
// -------- //

// STUDENTS //
router.get("/students", usersController.getStudentsFromCampus);

router.get("/student/:studentId", usersController.getStudentInfo);

router.get(
  "/students/:subjectId/:mode",
  usersController.getStudentsFromSubject
);

router.post(
  "/add-student",
  usersController.checkDuplicate,
  validationController.validateName("name"),
  validationController.validatePassword("password", "confPassword"),
  validationController.validateEmail("email"),
  usersController.createStudent
);

router.post("/delete-student/:studentId", usersController.deleteStudent);

router.post("/delete-teacher/:teacherId", usersController.deleteTeacher);
// -------- //

module.exports = router;

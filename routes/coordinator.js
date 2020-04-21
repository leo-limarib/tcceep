const express = require("express");
const router = express.Router();
const subjectsController = require("../controllers/subjects");
const usersController = require("../controllers/users");

router.get("/", (req, res) => {
  return res.render("coordinator", {
    layout: false,
    name: req.session.user["name"],
  });
});

// SUBJECTS //
router.get("/subjects", subjectsController.getSubjectsFromCampus);

router.post("/add-subject", subjectsController.addSubject);

router.get("/subject/info", subjectsController.getSubjectInfo);

router.post("/add-student/:subjectId", subjectsController.addStudent);
// -------- //

// TEACHERS //
router.get("/teachers", usersController.getTeachersFromCampus);

router.get("/teacher/:teacherId", usersController.getTeacherInfo);

router.post(
  "/add-teacher",
  usersController.checkDuplicate,
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
  usersController.createStudent
);

router.post("/delete-student/:studentId", usersController.deleteStudent);

router.post("/delete-teacher/:teacherId", usersController.deleteTeacher);
// -------- //

module.exports = router;

const express = require("express");
const router = express.Router();
const subjectsController = require("../controllers/subjects");
const usersController = require("../controllers/users");
const exercisesController = require("../controllers/exercises");
const scoresController = require("../controllers/scores");
const validationController = require("../controllers/validation");

router.get("/", (req, res) => {
  return res.render("teacher", {
    layout: false,
    name: req.session.user["name"],
  });
});

// SUBJECTS //
router.get("/subjects", subjectsController.getTeacherSubjects);

router.get(
  "/students/:subjectId/:mode",
  usersController.getStudentsFromSubject
);

router.get("/subject/:subjectId", subjectsController.getSubject);
// -------- //

// EXERCISES //
router.get("/exercise/:exerciseId", exercisesController.getExercise);

// req.params.exerciseId
router.post(
  "/exercise/delete/:exerciseId",
  validationController.validateId("exerciseId"),
  exercisesController.removeExercise,
  scoresController.deleteExerciseScores
);

router.get("/exercises", exercisesController.getTeacherExercises);

router.post(
  "/exercises/create",
  validationController.validateId("subjectId"),
  validationController.validateName("name"),
  exercisesController.addNewExercise
);

router.get("/exercises/:subjectId", exercisesController.getSubjectExercises);

router.get("/exercise/score/:exerciseId", scoresController.getExerciseScores);
// --------- //

// STUDENTS //
router.get("/student/:studentId", usersController.getStudentInfo);
// -------- //

module.exports = router;

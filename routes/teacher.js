const express = require("express");
const router = express.Router();
const subjectsController = require("../controllers/subjects");
const usersController = require("../controllers/users");
const exercisesController = require("../controllers/exercises");

router.get("/", (req, res) => {
    return res.render("teacher", {layout: false});
});

// SUBJECTS //
router.get("/subjects", subjectsController.getTeacherSubjects);

router.get("/students/:subjectId/:mode", usersController.getStudentsFromSubject);
// -------- //

// EXERCISES //
router.post("/exercises/create", exercisesController.addNewExercise);

router.get("/exercises/:subjectId", exercisesController.getSubjectExercises);
// --------- //

module.exports = router;

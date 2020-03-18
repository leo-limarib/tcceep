var exerciseSelected = null;

function showExerciseToSolve(exerciseId) {
  $("#solve-exercises").empty();
  exerciseSelected = exerciseId;
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/solve/${exerciseId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: exercise => {
      $("#solve-exercises").append(
        `<h2>${exercise.name}</h2><p>${exercise.teacher}</p>` +
          `<p>${exercise.subject}</p><br>` +
          `<p>${exercise.question}</p>` +
          `<p>${exercise.languages}</p>` +
          `<input type="file" name="code-input" placeholder="Código" id="code-input">` +
          `<button onclick="solveExercise()" accept=".py">Submeter</button>`
      );
    }
  });
}

function showSubjectExercises(subjectId) {
  $("#exercises").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/${subjectId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: exercises => {
      exercises.forEach(ex => {
        $("#exercises").append(
          `<div class="exercise-card"><h4>${ex.name}` +
            `</h4><p>${ex.question}</p>` +
            `<a onclick="showExerciseToSolve('${ex._id}')" >Resolver exercício</a></div>`
        );
      });
    }
  });
}

function listStudentSubjects() {
  $.ajax({
    type: "GET",
    url: window.location + `/subjects`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: subjects => {
      $("#student-subjects").append(`<ul id="subjects-list"></ul>`);
      subjects.forEach(sub => {
        $("#subjects-list").append(
          `<li style="cursor: pointer; font-size: 20px;" onclick="showSubjectExercises('${sub._id}')">${sub.name}</li>`
        );
      });
    }
  });
}

$(document).ready(() => {
  listStudentSubjects();
});

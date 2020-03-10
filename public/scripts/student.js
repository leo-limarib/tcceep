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
            `<a href="/">Resolver exercício</a></div>`
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

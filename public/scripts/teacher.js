function showSubjectExercises(subjectId) {
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/${subjectId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: exercises => {
      exercises.forEach(ex => {
        $("#subject-exercises").append(
          `<h3>${ex.name}</h3><p>${ex.question.replace(
            "\r\n",
            "<br>"
          )}</p><p>Linguagem: ${ex.languages[0]}</p>`
        );
      });
    }
  });
}

function showSubjectInfo(subjectId) {
  $("#subject-info").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/students/${subjectId}/in`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: students => {
      $("#subject-info").append(
        `<h3>Alunos matriculados:</h3><table id="sub-info-table"><thead><tr><th>Nome</th><th>Email</th></tr></thead><tbody></tbody></table>`
      );
      students.forEach(student => {
        $("#sub-info-table tbody").append(
          `<tr><td>${student.name}</td><td>${student.email}</td></tr>`
        );
      });
      showSubjectExercises(subjectId);
    }
  });
}

function listSubjects() {
  $.ajax({
    type: "GET",
    url: window.location + `/subjects`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: subjects => {
      subjects.forEach(subject => {
        $("#subjects-table tbody").append(
          `<tr style="cursor: pointer;" onclick="showSubjectInfo('${subject._id}')"><td>${subject.name}</td></tr>`
        );
        $("#select-subject").append(
          `<option value="${subject._id}">${subject.name}</option>`
        );
      });
    }
  });
}

$(document).ready(() => {
  listSubjects();
});

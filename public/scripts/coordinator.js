var selectedSubject = null;

function loadStudentsTable() {
  $("#students-table tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/students",
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: students => {
      students.forEach(student => {
        $("#students-table tbody").append(`<tr><td>${student.name}</td></tr>`);
      });
    }
  });
}

function loadTeachersTable() {
  $("#teachers-table tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/teachers",
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: teachers => {
      teachers.forEach(teacher => {
        $("#teachers-table tbody").append(`<tr><td>${teacher.name}</td></tr>`);
        $("#teacher-select").append(
          `<option value=${teacher._id}>${teacher.name}</option>`
        );
      });
    }
  });
}

function loadStudentsSelect(subjectId) {
  $.ajax({
    type: "GET",
    url: window.location + `/students/${subjectId}/nin`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: students => {
      students.forEach(student => {
        $("#add-student-subject").append(
          `<option value=${student._id}>${student.name}</option>`
        );
      });
    }
  });
}

function showSubjectStudents(subjectId) {
  $.ajax({
    type: "GET",
    url: window.location + `/students/${subjectId}/in`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: students => {
      students.forEach(student => {
        $("#students-subject").append(
          `<li>Nome: ${student.name} | Email: ${student.email}</li>`
        );
      });
      loadStudentsSelect(subjectId);
    }
  });
}

function showSubjectInfo(subjectId) {
  $("#show-subject-info").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/subject-info",
    contentType: "application/json",
    data: { subjectId: subjectId },
    dataType: "json",
    success: subject => {
      $("#show-subject-info").append(
        `<h3>${subject.name}</h3>` +
          `<p>PROFESSOR: ${subject.teacher}</p>` +
          `<h4>Alunos matriculados:</h4>` +
          `<ul id="students-subject"></ul>` +
          `<form action="/coordinator/add-student/${subjectId}" method="POST">` +
          `<select id="add-student-subject" name="studentId"><option value=""` +
          `disabled selected>Adicionar aluno</option></select><button` +
          ` type="submit">Adicionar</button></form>`
      );
      selectedSubject = subjectId;
      showSubjectStudents(subjectId);
    }
  });
}

function loadSubjectsTable() {
  $.ajax({
    type: "GET",
    url: window.location + "/subjects",
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: subjects => {
      subjects.forEach(sub => {
        $("#subjects-table tbody").append(
          `<tr><td style="cursor: pointer;" onclick="showSubjectInfo('${sub._id}')">${sub.name}</td></tr>`
        );
      });
    }
  });
}

$(document).ready(() => {
  loadSubjectsTable();
  loadTeachersTable();
  loadStudentsTable();
});

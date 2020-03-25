var selectedSubject = null;

//-- SUBJECTS PAGE --//
function addSubject() {
  $.ajax({
    type: "POST",
    url: window.location + "/add-subject",
    contentType: "application/json",
    data: JSON.stringify({
      name: $("#subject-name").val(),
      teacherId: $("#teacher-select option:selected").val()
    }),
    dataType: "json",
    success: () => {
      loadSubjectsTable();
      $("#subject-name").val("");
    }
  });
}

function loadTeachersSelect() {
  $("#teacher-select").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/teachers",
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: teachers => {
      teachers.forEach(t => {
        $("#teacher-select").append(
          `<option value="${t._id}">${t.name}</option>`
        );
      });
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
      //Lista de alunos matriculados = subject.students (só os ids)
      $("#show-subject-info").append(
        `Nome: ${subject.name} | Professor: ${subject.teacher}`
      );
    }
  });
}

function loadSubjectsTable() {
  $("#subjects-table tbody").empty();
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

function acionarMaterias() {
  esconderFormularios();
  var esconder = document.getElementById("materias");
  esconder.style.display = "block";
  loadSubjectsTable();
  loadTeachersSelect();
}
// SUBJECTS PAGE FINAL //

// -- TEACHERS PAGE -- //
function addTeacher() {
  $.ajax({
    type: "POST",
    url: window.location + "/add-teacher",
    contentType: "application/json",
    data: JSON.stringify({
      name: $("#teacher-name").val(),
      email: $("#teacher-email").val(),
      password: $("#teacher-password").val(),
      confPassword: $("#teacher-conf-password").val()
    }),
    dataType: "json",
    success: () => {
      loadTeachersTable();
      resetInputs([
        $("#teacher-name"),
        $("#teacher-email"),
        $("#teacher-password"),
        $("#teacher-conf-password")
      ]);
    }
  });
}

function showTeacherInfo(teacherId) {
  //TODO
  console.log(teacherId);
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
      teachers.forEach(t => {
        $("#teachers-table tbody").append(
          `<tr><td onclick="showTeacherInfo('${t._id}')">${t.name}</td></tr>`
        );
      });
    }
  });
}

function acionarProfessores() {
  esconderFormularios();
  var esconder = document.getElementById("professores");
  esconder.style.display = "block";
  //document.getElementById('bt2').style.color = '#21E6C1'
  loadTeachersTable();
}
// TEACHERS PAGE FINAL //

// -- STUDENTS PAGE -- //
function addStudent() {
  $.ajax({
    type: "POST",
    url: window.location + "/add-student",
    contentType: "application/json",
    data: JSON.stringify({
      name: $("#student-name").val(),
      email: $("#student-email").val(),
      password: $("#student-password").val(),
      confPassword: $("#student-conf-password").val()
    }),
    dataType: "json",
    success: () => {
      loadStudentsTable();
      resetInputs([
        $("#student-name"),
        $("#student-email"),
        $("#student-password"),
        $("#student-conf-password")
      ]);
    }
  });
}

function loadStudentsTable() {
  $("#students-table tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/students",
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: students => {
      students.forEach(s => {
        $("#students-table tbody").append(`<tr><td>${s.name}</td></tr>`);
      });
    }
  });
}

function acionarAlunos() {
  esconderFormularios();
  var esconder = document.getElementById("alunos");
  esconder.style.display = "block";
  loadStudentsTable();
}
// STUDENTS PAGE FINAL //

function resetInputs(inputs) {
  inputs.forEach(i => {
    i.val("");
  });
}

function esconderFormularios() {
  document.getElementById("materias").style.display = "none";
  document.getElementById("professores").style.display = "none";
  document.getElementById("alunos").style.display = "none";
}

/* Hover das opções do menu lateral */
$(document).ready(function() {
  esconderFormularios();
  $(".hoverJQuery").hover(
    function() {
      $(this).css("color", "#21E6C1");
      $(this)
        .children()
        .css("color", "#21E6C1");
    },
    function() {
      $(this).css("color", "#BFC0C2");
      $(this)
        .children()
        .css("color", "#258a7a");
    }
  );
});

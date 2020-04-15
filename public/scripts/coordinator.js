var selectedSubject = null;

//-- SUBJECTS PAGE --/
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
    url: window.location + "/subject/info",
    contentType: "application/json",
    data: { subjectId: subjectId },
    dataType: "json",
    success: subject => {
      //Lista de alunos matriculados = subject.students (só os ids)
      console.log(subject);
      $("#show-subject-info").append(
        `Nome: ${subject.name} | Professor: ${subject.teacher}`
      );

      //TEMPORARY
      $("#show-subject-info").append(
        `<h3 style="margin: 0;">Alunos matriculados</h3><ul id="registered-list"></ul>`
      );
      subject.registeredStudents.forEach(student => {
        $("#registered-list").append(`<li>${student.name}</li>`);
      });

      $("#show-subject-info").append(
        `<br><h3 style="margin: 0;">Alunos não matriculados</h3><ul id="non-registered-list"></ul>`
      );
      subject.nonRegisteredStudents.forEach(student => {
        $("#non-registered-list").append(`<li>${student.name}</li>`);
      });
      // -----------//
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
          `<tr style="cursor: pointer;" onclick="showSubjectInfo('${sub._id}')">
            <td>${sub.name}</td>
            <td>${sub.teacherName}</td>
            <td>Em andamento</td>
          </tr>`
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
  document.getElementById("profSecond").style.display = "none";
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
          `<tr onclick="showTeacherInfo('${t._id}')">
              <td>${t.name}</td>
              <td>${t.email}</td>
          </tr>`
        );
      });
    }
  });
}

function acionarProfessores() {
  esconderFormularios();
  var esconder = document.getElementById("profMain");
  esconder.style.display = "block";
  loadTeachersTable();
}

function acionarProfessoresAdd() {
  var esconder = document.getElementById("profSecond");
  esconder.style.display = "block";
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
  document.getElementById("alunoSecond").style.display = "none";
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
        $("#students-table tbody").append(
          `<tr>
            <td>${s.name}</td>
            <td>${s.email}</td>
          </tr>`
        );
      });
    }
  });
}

function acionarAlunos() {
  esconderFormularios();
  var esconder = document.getElementById("alunoMain");
  esconder.style.display = "block";
  loadStudentsTable();
}

function acionarAlunosAdd() {
  var esconder = document.getElementById("alunoSecond");
  esconder.style.display = "block";
}
// STUDENTS PAGE FINAL //

function resetInputs(inputs) {
  inputs.forEach(i => {
    i.val("");
  });
}

function esconderFormularios() {
  document.getElementById("materias").style.display = "none";
  document.getElementById("profMain").style.display = "none";
  document.getElementById("profSecond").style.display = "none";
  document.getElementById("alunoMain").style.display = "none";
  document.getElementById("alunoSecond").style.display = "none";
}

function backToSubject(){
  document.getElementById("materiaDados").style.display = "none";
  acionarMaterias();
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

/* Selected Botton */ /*  //FAIL
$(document).ready(function(){
  $(".testeBt1").click(
    function(){
      $(this).addClass("buttonSelected");
      $(this)
        .children()
        .addClass("buttonSelected");
  })
}) */





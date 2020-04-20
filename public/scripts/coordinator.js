var selectedSubject = null;

//-- SUBJECTS PAGE --/
function addSubject() {
  $.ajax({
    type: "POST",
    url: window.location + "/add-subject",
    contentType: "application/json",
    data: JSON.stringify({
      name: $("#subject-name").val(),
      teacherId: $("#teacher-select option:selected").val(),
    }),
    dataType: "json",
    success: () => {
      loadSubjectsTable();
      $("#subject-name").val("");
    },
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
    success: (teachers) => {
      teachers.forEach((t) => {
        $("#teacher-select").append(
          `<option value="${t._id}">${t.name}</option>`
        );
      });
    },
  });
}

//Tabela alunos matriculados
function showSubjectMatriculados(subjectId){
  $("#show-subject-info-matriculados tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/subject/info",
    contentType: "application/json",
    data: { subjectId: subjectId },
    dataType: "json",
    success: subject => {
      subject.registeredStudents.forEach(student => {
        $("#show-subject-info-matriculados tbody").append(
          `<tr style="cursor: pointer;">
            <td>${student.name}</td>
            <td>${student.email}</td>
          </tr>`);
      });
    }
  });
}

//Tabela alunos não matriculados
function naoMatriculados(subjectId){
  $("#show-subject-info-nao-matriculados tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/subject/info",
    contentType: "application/json",
    data: { subjectId: subjectId },
    dataType: "json",
    success: subject => {
      subject.nonRegisteredStudents.forEach(student => {
        $("#show-subject-info-nao-matriculados tbody").append(
          `<tr style="cursor: pointer;">
            <td>${student.name}</td>
            <td>${student.email}</td>
          </tr>`);
      });
    }
  });
}

function retornaNomeMateria(subjectId){
  $("#nomeDaMateria").empty();
  $.ajax({
    type: "GET",
    url: window.location + "/subject/info",
    contentType: "application/json",
    data: { subjectId: subjectId },
    dataType: "json",
    success: subject => {
      $("#nomeDaMateria").append(
        `<h3>${subject.name}</h3>`
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
    success: (subjects) => {
      subjects.forEach((sub) => {
        $("#subjects-table tbody").append(
          `<tr style="cursor: pointer;" onclick="showSubjectMatriculados('${sub._id}'); naoMatriculados('${sub._id}'); retornaNomeMateria('${sub._id}'); acionarMateriaDados()">
            <td>${sub.name}</td>
            <td>${sub.teacherName}</td>
            <td>Em andamento</td>
          </tr>`
        );
      });
    },
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
      confPassword: $("#teacher-conf-password").val(),
    }),
    dataType: "json",
    success: () => {
      loadTeachersTable();
      resetInputs([
        $("#teacher-name"),
        $("#teacher-email"),
        $("#teacher-password"),
        $("#teacher-conf-password"),
      ]);
    },
  });
  document.getElementById("profSecond").style.display = "none";
}

function showTeacherInfo(teacherId) {
  $.ajax({
    type: "GET",
    url: window.location + `/teacher/${teacherId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (info) => {
      console.log(info);
    },
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
    success: (teachers) => {
      teachers.forEach((t) => {
        $("#teachers-table tbody").append(
          `<tr onclick="showTeacherInfo('${t._id}')">
              <td>${t.name}</td>
              <td>${t.email}</td>
          </tr>`
        );
      });
    },
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
      confPassword: $("#student-conf-password").val(),
    }),
    dataType: "json",
    success: () => {
      loadStudentsTable();
      resetInputs([
        $("#student-name"),
        $("#student-email"),
        $("#student-password"),
        $("#student-conf-password"),
      ]);
    },
  });
  document.getElementById("alunoSecond").style.display = "none";
}

function showStudentInfo(studentId) {
  $.ajax({
    type: "GET",
    url: window.location + `/student/${studentId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (info) => {
      console.log(info);
    },
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
    success: (students) => {
      students.forEach((s) => {
        $("#students-table tbody").append(
          `<tr onclick="showStudentInfo('${s._id}')">
            <td>${s.name}</td>
            <td>${s.email}</td>
          </tr>`
        );
      });
    },
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
  inputs.forEach((i) => {
    i.val("");
  });
}

function esconderFormularios() {
  document.getElementById("materias").style.display = "none";
  document.getElementById("profMain").style.display = "none";
  document.getElementById("profSecond").style.display = "none";
  document.getElementById("alunoMain").style.display = "none";
  document.getElementById("alunoSecond").style.display = "none";
  document.getElementById("materiaDados").style.display = "none";
}

function backToSubject() {
  document.getElementById("materiaDados").style.display = "none";
  acionarMaterias();
}

function acionarMateriaDados(){
  document.getElementById("materias").style.display = "none";
  document.getElementById("materiaDados").style.display = "block";
}

/* Hover das opções do menu lateral */
$(document).ready(function () {
  esconderFormularios();
  $(".hoverJQuery").hover(
    function () {
      $(this).css("color", "#21E6C1");
      $(this).children().css("color", "#21E6C1");
    },
    function () {
      $(this).css("color", "#BFC0C2");
      $(this).children().css("color", "#258a7a");
    }
  );
});

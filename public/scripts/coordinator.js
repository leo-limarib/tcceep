var selectedSubject = null;

//TODO
/*
  Por enquanto estamos usando um form no html para
adicionar uma nova matéria. Isso faz com que o formulário
redirecione o usuário pra outra página no submit.
  Devemos criar uma função usando o js pra fazer o submit 
do formulário e só atualizar a tabela qnd obtiver a resposta.
*/

//-- SUBJECTS PAGE --//
function formListener() {
  $("#new-subject-form").submit(() => {
    loadSubjectsTable();
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
// SUBJECTS PAGE FINAL //

function esconderFormularios() {
  document.getElementById("materias").style.display = "none";
  document.getElementById("professores").style.display = "none";
  document.getElementById("alunos").style.display = "none";
}

function acionarMaterias() {
  esconderFormularios();
  var esconder = document.getElementById("materias");
  esconder.style.display = "block";
  loadSubjectsTable();
  loadTeachersSelect();
}

function acionarProfessores() {
  esconderFormularios();
  var esconder = document.getElementById("professores");
  esconder.style.display = "block";
  //document.getElementById('bt2').style.color = '#21E6C1'
}

function acionarAlunos() {
  esconderFormularios();
  var esconder = document.getElementById("alunos");
  esconder.style.display = "block";
  //document.getElementById('bt3').style.color = '#21E6C1'
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

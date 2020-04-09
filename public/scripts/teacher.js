function showSubjectExercises(subjectId) {
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/${subjectId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: exercises => {
      $("#subject-exercises").empty();
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
        `<h3>Alunos matriculados</h3>
        <div>
          <table id="sub-info-table"><thead><tr><th>Nome</th><th>Email</th></tr></thead><tbody></tbody></table>
        </div>`
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
          `<div class="subjectStyle" style="cursor: pointer;" onclick="showSubjectInfo('${subject._id}')">
            <tr><td><h4>${subject.name}</h4></td></tr>
          </div>`
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

/* Hover Left Buttons */
$(document).ready(function() {
  hiddenForm();
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

function hiddenForm() {
  document.getElementById("materias").style.display = "none"
  document.getElementById("exercicios").style.display = "none"
  /*document.getElementById("subject-info").style.display = "none"*/
}

function displaySubject() {
  hiddenForm()
  document.getElementById("materias").style.display = "block"
}

function displayExercise() {
  hiddenForm();
  document.getElementById("exercicios").style.display = "block"
}
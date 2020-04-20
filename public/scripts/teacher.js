function showSubjectExercises(subjectId) {
  $("#subject-exercises").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/${subjectId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: exercises => {
      exercises.forEach(ex => {
        $("#subject-exercises").append(
          `<tr style="cursor: pointer;">
            <td>${ex.name}</td>
            <td>${ex.languages[0]}</td>
          </tr>`
        );
      });
    }
  });
}

function showSubjectInfo(subjectId) {
  document.getElementById("subject-InfoExercises").style.display = "block"
  $("#subject-info tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/students/${subjectId}/in`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: students => {
      students.forEach(student => {
        $("#subject-info tbody").append(
          `<tr style="cursor: pointer;">
            <td>${student.name}</td>
            <td>${student.email}</td>
          </tr>`
        );
      });
    }
  });
}

/* ESSA MERDA N FUNCIONA */
function listExercises() {
  $("#subject-ex tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/exercises`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: exercises => {
      exercises.forEach(ex => {
        $("#subject-ex tbody").append(
          `<tr style="cursor: pointer;">
            <td>${ex.name}</td>
            <td>${ex.name}</td>
            <td>${ex.languages[0]}</td>
          </tr>`
        );
      });
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
          `<div class="subjectStyle" style="cursor: pointer;" onclick="showSubjectInfo('${subject._id}'); showSubjectExercises('${subject._id}')">
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
  document.getElementById("exerciciosMain").style.display = "none"
  document.getElementById("subject-InfoExercises").style.display = "none"
}

function displaySubject() {
  hiddenForm()
  document.getElementById("materias").style.display = "block"
}

function displayExercise() {
  hiddenForm();
  document.getElementById("exerciciosMain").style.display = "block"
  listExercises()
}

function displayExerciseAdd() {
  hiddenForm();
  document.getElementById("exercicios").style.display = "block"
}
var exerciseSelected = null;
var testCases = { inputs: [], outputs: [] };

function addMenuHoverEffect() {
  $(".hoverJQuery").hover(
    () => {
      $(event.target).addClass("button-hovered");
      $(event.target).children().addClass("button-hovered");
    },
    () => {
      $(event.target).removeClass("button-hovered");
      $(event.target).children().removeClass("button-hovered");
    }
  );
}

function loadSubjectExercisesTable(subjectId) {
  // /exercises/:subjectId
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/${subjectId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (exercises) => {
      exercises.forEach((ex) => {
        $("#subject-exercises-table tbody").append(
          `<tr><td>${ex.name}</td><td>${ex.languages}</td></tr>`
        );
      });
    },
  });
}

function loadSubjectStudentsTable(subjectId) {
  $.ajax({
    type: "GET",
    url: window.location + `/students/${subjectId}/in`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (students) => {
      $("#subject-students-table tbody").empty();
      students.forEach((student) => {
        $("#subject-students-table tbody").append(
          `<tr><td>${student.name}</td><td>${student.email}</td></tr>`
        );
      });
    },
  });
}

function showSubjectInfo(subjectId) {
  $(".teacher-rightside").empty();
  $(".teacher-rightside")
    .append(`<div style="margin-top: 6rem; text-align: center;"><h3 style="margin-top: 4rem;">Alunos matriculados</h3>
    <div class="table-div" style="width: 90%; margin: 0 auto;">
        <table id="subject-students-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <h3 style="margin-top: 6rem;">Exercícios</h3>
    <div class="table-div" style="width: 90%; margin: 0 auto;">
        <table id="subject-exercises-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Linguagens</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div></div>`);
  loadSubjectStudentsTable(subjectId);
  loadSubjectExercisesTable(subjectId);
}

function loadSubjectsTable() {
  $("#subjects-table tbody").empty();
  $(".teacher-rightside").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/subjects`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (subjects) => {
      subjects.forEach((subject) => {
        $.ajax({
          type: "GET",
          url: window.location + `/exercises/${subject._id}`,
          contentType: "application/json",
          data: null,
          dataType: "json",
          success: (exercises) => {
            $("#subjects-table tbody").append(
              `<tr onclick="showSubjectInfo('${subject._id}')"><td>${subject.name}</td><td>${subject.studentIds.length}</td><td>${exercises.length}</td></tr>`
            );
          },
        });
      });
    },
  });
}

function displaySubject() {
  //Update the sidebar buttons
  $(".hoverJQuery").removeClass("button-selected");
  $(".hoverJQuery").children().removeClass("button-selected");
  $("#bt1").addClass("button-selected");
  $("#bt1").children().addClass("button-selected");

  //Show the subjects mainboard
  $(".teacher-mainboard").empty();
  $(".teacher-mainboard").append(`<div class="col-7 teacher-leftside">
  <div style="width: 100%; margin-top: 4rem;">
      <div style="float: right;">
          <button class="new-button-style" onclick="loadSubjectsTable()"><i class="fas fa-sync"></i></button>
      </div>
  </div>
  <br>
  <div class="table-div">
      <table id="subjects-table">
          <thead>
              <tr>
                  <th>Nome</th>
                  <th>Alunos</th>
                  <th>Exercícios</th>
              </tr>
          </thead>
          <tbody>
          </tbody>
      </table>
  </div>
</div>
<div class="col-5 teacher-rightside"></div>`);
  loadSubjectsTable();
}

function deleteExercise(exerciseId) {
  $.ajax({
    // /exercise/delete/:exerciseId
    type: "POST",
    url: window.location + `/exercise/delete/${exerciseId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: () => {
      displayExercise();
      exerciseSelected = null;
    },
  });
}

function getExerciseScores(exerciseId) {
  $.ajax({
    type: "GET",
    url: window.location + `/exercise/score/${exerciseId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (scores) => {
      scores.forEach((score) => {
        // /student/:studentId
        $("#scores-table tbody").append(
          `<tr><td>${score.ownerEmail}</td><td>Python 3</td><td>${score.score}</td></tr>`
        );
      });
    },
  });
}

function showExerciseDetails(exerciseId) {
  $(".exercises-rightside").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/exercise/${exerciseId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (ex) => {
      $(".exercises-rightside")
        .append(`<h3 style="display: inline-block; margin-top: 3rem; margin-left: 4rem; margin-right: 1rem;">${ex.name}</h3>
  <button class="delete-button" onclick="deleteExercise('${ex._id}')"><i class="fas fa-trash"></i></button>
  <hr class="rightsidehr">
  <h4 style="margin-left: 4rem;">${ex.languages}</h4>
  <div class="rightside-info-pad">
    ${ex.question}</div>
  <div class="table-div" style="width: 80%; margin: 1rem auto;">
    <table id="scores-table">
        <thead>
            <tr>
                <th>Aluno</th>
                <th>Linguagem</th>
                <th>Pontuação</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
  </div>`);
      getExerciseScores(ex._id);
    },
  });
}

function loadSubjectSelect() {
  $.ajax({
    type: "GET",
    url: window.location + `/subjects`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (subjects) => {
      subjects.forEach((sub) => {
        $("#ex-subject").append(
          `<option value="${sub._id}">${sub.name}</option>`
        );
      });
    },
  });
}

function addNewExercise() {
  $.ajax({
    type: "POST",
    url: window.location + `/exercises/create`,
    contentType: "application/json",
    data: JSON.stringify({
      name: $("#ex-name").val(),
      subjectId: $("#ex-subject option:selected").val(),
      question: $("#ex-question").val().replace(/\r?\n/g, "<br>"),
      inputs: testCases.inputs,
      outputs: testCases.outputs,
    }),
    dataType: "json",
    success: () => {
      exerciseSelected = null;
      testCases = { inputs: [], outputs: [] };
      displayExercise();
    },
    error: (err) => {
      alert(err.responseJSON.message);
    },
  });
}

function addTestCase() {
  testCases.inputs.push($("#new-input").val());
  testCases.outputs.push($("#new-output").val());
  $("#test-cases-table tbody").append(
    `<tr><td>${$("#new-input").val()}</td><td>${$(
      "#new-output"
    ).val()}</td></tr>`
  );
}

function showAddExerciseBoard() {
  $(".teacher-mainboard").empty();
  $(".teacher-mainboard")
    .append(`<div class="container-fluid" style="padding: 2rem 4rem;">
  <div class="row">
      <div class="col-12">
          <p style="text-decoration: underline; cursor: pointer;" onclick="displayExercise()">Voltar...</p>
      </div>
  </div>
  <div class="row">
      <div class="col-6">
          <input type="text" class="input-title" placeholder="Nome do exercício" id="ex-name">
      </div>
      <div class="col-6" style="padding-top: 1rem;">
          <button class="save-button" onclick="addNewExercise()">Adicionar exercício</button>
      </div>
  </div>
  <hr style="border: 1px solid #292E33;">
  <div class="row">
      <div class="col-6">
          <select id="ex-subject" class="select-style">
              <option value="" selected disabled hidden>Escolher matéria</option>
          </select>
          <div>
              <textarea id="ex-question" cols="55" rows="20"
                  placeholder="Inserir explicação do exercício" id="ex-question"></textarea>
          </div>
      </div>
      <div class="col-5" style="padding-top: 3rem;">
          <p>Linguagem: Python 3</p>
          <div class="table-div" style="margin-bottom: 1rem;">
              <table id="test-cases-table">
                  <thead>
                      <tr>
                          <th>Inputs</th>
                          <th>Outputs</th>
                      </tr>
                  </thead>
                  <tbody></tbody>
              </table>
          </div>
          <div class="row">
              <div class="col-12">
                  <input type="text" placeholder="Novo input" class="new-input-style" id="new-input">
                  <input type="text" placeholder="Novo output" class="new-input-style"
                      style="margin-left: 1rem;" id="new-output">
                  <button class="new-button-style" onclick="addTestCase()"><i class="fas fa-arrow-up"></i></button>
              </div>
          </div>
      </div>
  </div>
</div>`);
  loadSubjectSelect();
}

function loadExercisesTable() {
  $("#teacher-exercises-table tbody").empty();
  $.ajax({
    type: "GET",
    url: window.location + `/exercises`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (exercises) => {
      exercises.forEach((ex) => {
        $.ajax({
          type: "GET",
          url: window.location + `/exercise/score/${ex._id}`,
          contentType: "application/json",
          data: null,
          dataType: "json",
          success: (scores) => {
            $.ajax({
              type: "GET",
              url: window.location + `/subject/${ex.subjectId}`,
              contentType: "application/json",
              data: null,
              dataType: "json",
              success: (sub) => {
                $("#teacher-exercises-table tbody").append(
                  `<tr onclick="showExerciseDetails('${ex._id}')"><td>${ex.name}</td><td>${sub.name}</td><td>${scores.length}</td></tr>`
                );
              },
            });
          },
        });
      });
    },
  });
}

function displayExercise() {
  exerciseSelected = null;
  testCases = { inputs: [], outputs: [] };

  //Update the sidebar buttons
  $(".hoverJQuery").removeClass("button-selected");
  $(".hoverJQuery").children().removeClass("button-selected");
  $("#bt2").addClass("button-selected");
  $("#bt2").children().addClass("button-selected");

  $(".teacher-mainboard").empty();
  $(".teacher-mainboard").append(`<div class="container-fluid">
  <div class="row" style="padding: 0; padding-top: 4rem;">
      <div class="col-7 exercises-leftside">
          <div style="width: 100%; padding: 0;">
              <div style="float: right;">
                  <button class="new-button-style" onclick="showAddExerciseBoard()" id="add-exercise-button"><i class="fas fa-plus"></i></button>
                  <button class="new-button-style"><i class="fas fa-sync-alt"></i></button>
              </div>
          </div>
          <br>
          <div class="table-div">
              <table id="teacher-exercises-table">
                  <thead>
                      <tr>
                          <th>Nome</th>
                          <th>Matéria</th>
                          <th>Resoluções</th>
                      </tr>
                  </thead>
                  <tbody></tbody>
              </table>
          </div>
      </div>
      <div class="col-5 exercises-rightside"></div>
  </div>
</div>`);
  loadExercisesTable();
}

$(document).ready(() => {
  addMenuHoverEffect();
});

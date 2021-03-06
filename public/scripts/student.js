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

function showSubjectTeacher(teacherId) {
  $.ajax({
    type: "GET",
    url: window.location + `/teacher/${teacherId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (info) => {
      $("#sub-teacher").text(`Prof. ${info.teacher.name}`);
    },
  });
}

function solveExercise(exerciseId) {
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/solve/${exerciseId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (exercise) => {
      $(".student-mainboard").empty();
      $(".student-mainboard")
        .append(`<div class="row solve-exercise" style="padding: 2rem 3rem;">
      <div class="col-12">
          <h3>${exercise.name}</h3>
          <p>Matéria: ${exercise.subject}</p>
          <p>Prof. ${exercise.teacher}</p>
          <hr style="border: 1px solid #292E33;">
          <form action="/student/exercises/solve/${exerciseId}" method="POST" enctype="multipart/form-data">
              <label name="exercise-id" value="${exercise._id}"></label>
              <select id="language" class="select-style">
                  <option value="" selected disabled hidden>Python 3</option>
              </select>
              <div class="question-div">${exercise.question}</div>
              <br>
              <input type="file" name="input_file" placeholder="Código" id="code-input" accept=".py">
              <br>
              <button class="new-button-style" style="margin-top: 1rem;">Submeter código</button>
          </form>
      </div>
  </div>`);
    },
  });
}

function showSubjectExercises(subjectId) {
  $.ajax({
    type: "GET",
    url: window.location + `/exercises/${subjectId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (exercises) => {
      exercises.forEach((ex) => {
        $.ajax({
          type: "GET",
          url: window.location + `/score/${ex._id}`,
          contentType: "application/json",
          data: null,
          dataType: "json",
          success: (score) => {
            $(".execises-list")
              .append(`<div class="exercise-card" style="margin-top: 1rem;">
            <div style="display; inline-block;">
                <h3>${ex.name}</h3>
                <p>Pontuação: ${score.score}</p>
            </div>
            <div style="display: inline-block; margin-top: 0.5rem;">
                <button class="new-button-style" onclick="solveExercise('${ex._id}')">Resolver</button>
            </div>
        </div>`);
          },
        });
      });
    },
  });
}

function showSubjectInfo(subjectId) {
  $.ajax({
    type: "GET",
    url: window.location + `/subject/${subjectId}`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (subject) => {
      $("#sub-name").text(subject.name);
      showSubjectTeacher(subject.teacherId);
      showSubjectExercises(subjectId);
    },
  });
}

function showSubjects(subjectId) {
  $(".student-mainboard").empty();
  $(".student-mainboard")
    .append(`<div class="row show-exercises-tab" style="padding: 2rem 3rem;">
    <div class="col-12">
        <h3 id="sub-name"></h3>
        <p id="sub-teacher">Prof. </p>
    </div>
    <div class="col-8 execises-list">
    </div>
</div>`);
  showSubjectInfo(subjectId);
}

function displayExercisesTab() {
  $(".student-mainboard").empty();
  $(".student-mainboard")
    .append(`<div class="row exercises-subjects-list" style="padding: 4rem 12rem;">
</div>`);
  $.ajax({
    type: "GET",
    url: window.location + `/subjects/`,
    contentType: "application/json",
    data: null,
    dataType: "json",
    success: (subjects) => {
      // /exercises/:subjectId
      subjects.forEach((sub) => {
        $.ajax({
          type: "GET",
          url: window.location + `/exercises/${sub._id}`,
          contentType: "application/json",
          data: null,
          dataType: "json",
          success: (exercises) => {
            $(".exercises-subjects-list").append(`<div class="col-6">
            <div class="subject-card">
                <h3>${sub.name}</h3>
                <hr style="border: 1px solid #707070;">
                <p>${exercises.length} exercícios disponíveis.</p>
                <button class="new-button-style" onclick="showSubjects('${sub._id}')">Resolver</button>
            </div>
        </div>`);
          },
        });
      });
    },
  });
}

$(document).ready(() => {
  addMenuHoverEffect();
});

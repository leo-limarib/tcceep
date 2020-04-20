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

function displaySubject() {}

$(document).ready(() => {
  addMenuHoverEffect();
});

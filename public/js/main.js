$(document).ready(function() {
    setTimeout(function(){
        document.getElementById('bodyTimer').classList.add('hidetimer');
       }, 5000);
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

function toggleFunction() {
    var x = document.getElementById("dispositionContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
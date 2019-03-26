$(document).ready(function() {
    setTimeout(function(){
        document.getElementById('bodyTimer').classList.add('hidetimer');
       }, 5000);
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

/*Test switch toggle Nav creation Pam's */
function dispositionToggle() {
    var x = document.getElementById("dispositionContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

function backgroundToggle() {
    var x = document.getElementById("backgroundContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

var slider = document.getElementById("opacityRange");
var output = document.getElementById("opacityValue");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

/*
var _actionToDropZone = $("#form_snippet_image").attr('action');

Dropzone.autoDiscover = false;
var myDropzone = new Dropzone("#form_snippet_image", { url: _actionToDropZone });

myDropzone.on("addedfile", function(file) {
  alert('nouveau fichier reçu');
});*/
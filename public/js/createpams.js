
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$(document).on('click', '#backgroundToggle', function () {
    backgroundPopupToggle();
    return false;
});

$(document).on('click', '#colorPickerLabel', function () {
  colorPickerPopupToggle();
  return false;
});


$(document).on('click', '#dispositionToggle', function () {
    dispositionPopupToggle();
    return false;
});

/**Toggle tempsréel des layouts***/
$(document).on('change', '.input-disposition', function(e) {
	var $this = $(this);
	var value = $this.val();
	toggleDisposition(value);
});

$(document).on('change', '#colorPicker', function(e) {
  changeBgColor();
  return false;
});

/*opacity & colorpicker*/

$("#colorPicker").spectrum({
  preferredFormat: "hex",
  flat: true,
  showInput: true,
  showAlpha: true,
  allowEmpty:true,
  palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)"]]
});

var slider = document.getElementById("opacityRange");
var output = document.getElementById("opacityValue");
output.innerHTML = slider.value; 

slider.oninput = function() {
  output.innerHTML = this.value;
}


   /**************
     * Functions*
    ****************/

/*couleur arrière-plan*/
function changeBgColor(){
  var color = $("#colorPicker").spectrum("get");
  console.log(color);
  document.body.style.backgroundColor = color;
}



/**Gestion des popups*/
function backgroundPopupToggle() {
    var x = document.getElementById("backgroundContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

function dispositionPopupToggle() {
    var x = document.getElementById("dispositionContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

function colorPickerPopupToggle() {
    var x = document.getElementById("colorPickerContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  
  /*Layouts*/
  function toggleDisposition(disposition) {
	var $active = $('.disposition-active');
	var $target = $('#'+disposition);

	// Si la sélection est celle déjà active, on fait rien
	if ($target.is($active)) return false;

	// Si déjà une d'active
	if ($active.length > 0) {
		$active.removeClass('disposition-active');
	}
	$target.addClass('disposition-active');
}







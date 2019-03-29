var current_block_id = null;

/*opacity & colorpicker*/

$("#colorPicker").spectrum({
  preferredFormat: "hex",
  flat: true,
  showInput: true,
  showAlpha: true,
  allowEmpty:true
});

var slider = document.getElementById("opacityRange");
var output = document.getElementById("opacityValue");
output.innerHTML = slider.value; 

slider.oninput = function() {
  output.innerHTML = this.value;
}

/*events*/

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

$(document).on('click', '#modalTextFormToggle', function () {
  modalTextFormContainerToggle();
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

$(document).on('change', '#opacityRange', function(e) {
  changeBgOpacity();
  return false;
});

/*trigger reset*/
$('#createContentModal').on('hidden.bs.modal', function () {
  resetCurrentBlockValue();
  resetTextArea();
});

/********************* ajout de texte ****************************/

$(document).on('submit','#modalTextForm', function(e){
  populateText();
  return false;
});

$(document).on('click','.trigger-modal-block', function(e){
  findModalBlock(this);
});

function findModalBlock(elementClicked){
  var $this = $(elementClicked); // on récup l'élément cliqué en jQuery
  var $block = $this.closest('.createContent') // ça récupère l'élément le plus proche avec cette classe (le bloc parent dans l'idée)
  var block_id = $block.attr('id');
  current_block_id = block_id;
  
}

/**ajout dynamique de texte */
function populateText(){
  var user_text = $("#toFill").val();
  $('#'+current_block_id).find('.to-populate').html(user_text);
}




   /**************
     * Functions*
    ****************/


  
/*reset à la fermeture des modals*/
function resetCurrentBlockValue(){
  current_block_id = null;
}

function resetTextArea(){
  $("#toFill").val("");
}

/*couleur arrière-plan*/
function changeBgColor(){
  var color = $("#colorPicker").spectrum("get");
  document.getElementById("createBody").style.backgroundColor = color;
}

function changeBgOpacity(){
  var bgopacity = $("#opacityRange").val();
  console.log(bgopacity);
  $("#createBody").css('opacity', bgopacity/100);
}

/*Upload image*/
document.getElementById('imagePicker').addEventListener('change', readURL, true);
function readURL(){
    var file = document.getElementById("imagePicker").files[0];
    var reader = new FileReader();
    reader.onloadend = function(){
        document.getElementById('createBody').style.backgroundImage = "url(" + reader.result + ")";        
    }
    if(file){
        reader.readAsDataURL(file);
    }else{
    }
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

function modalTextFormContainerToggle() {
    var x = document.getElementById("modalTextFormContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }



  $('#dispositionForm').submit(function () {
    dispositionPopupToggle();
    return false;
   });


  
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







var current_block_id = null;
var current_audio_id = null;
var playing = false;

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

$(document).on('click', '#audioToggle', function () {
  toggleAudio();
  return false;
});

$(document).on('click', '#modalTextFormToggle', function () {
  modalTextFormContainerToggle();
  return false;
});


$(document).on('click', '#imageGalleryToggleLabel', function () {
  imageGalleryContainerToggle();
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

$('#dispositionForm').submit(function () {
  dispositionPopupToggle();
  return false;
 });

/*trigger reset*/
$('#createContentModal').on('hidden.bs.modal', function () {
  resetCurrentBlockValue();
  resetTextArea();
});

/**trigger delete image */
$('.content-added').click(function() {
  findModalBlock(this);
  removeContent();
});

/*******************************************
**** Widget choix de l'image de fond*********
*******************************************/

/*cibler la vignette musique*/
function findImageID(elementClicked){
  var $this = $(elementClicked); // on récup l'élément cliqué en jQuery
  $this.off("click");
  var $li = $this.closest('.image-list-item') // ça récupère l'élément le plus proche avec cette classe (le bloc parent dans l'idée)
  var li_id = $li.attr('id');
  current_image_id = li_id;
  console.log(current_image_id);
}

/*ajouter sélecteur image*/
$('.image-list-item img').on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  var $current = $('.selected-image');
  $current.removeClass('selected-image');
  $this.addClass('selected-image');
})

$('#bgImageForm').submit(function (e) {
  imageGalleryContainerToggle();
  backgroundPopupToggle();
  return false;
 });



/*******************************************
******* Widget choix de la musique*********
*******************************************/

$('#musiqueSelect').change(function(){
  var criteria = $(this).val();
  if(criteria == 'ALL'){
      $('.lilist').show();
      return;
  }
  $('.categorie').each(function(i,option){
      if($(this).html() == criteria){
          $(this).parent().show();
      }else {
          $(this).parent().hide();
      }
  });
});

$('#musiqueUploader').change(function(){
  var sound = document.getElementById('sound');
  sound.src = URL.createObjectURL(this.files[0]);
  // not really needed in this exact case, but since it is really important in other cases,
  // don't forget to revoke the blobURI when you don't need it
  sound.onend = function(e) {
    URL.revokeObjectURL(this.src);
  }
});

$(document).on('click','.music-list-item', function(e){
  findMusicId(this);
});

/*cibler la vignette musique*/
function findMusicId(elementClicked){
  var $this = $(elementClicked); // on récup l'élément cliqué en jQuery
  $this.off("click");
  var $li = $this.closest('.music-list-item') // ça récupère l'élément le plus proche avec cette classe (le bloc parent dans l'idée)
  var li_id = $li.attr('id');
  current_audio_id = li_id;
  playSelectedMusic();
}

/*ajouter sélecteur musique*/
$('.music-list-item img').on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  var $current = $('.selected-audio');
  $current.removeClass('selected-audio');
  $this.addClass('selected-audio');
  displaySubmitAudio();
  playSelectedMusic();
})


function playSelectedMusic(){
  var audio = $("#Audio"+current_audio_id);
   if (playing == false) {
    audio[0].play();
    playing = true;
   } else {
    audio[0].pause();
    playing = false;
   }
}
  
function stopSelectedMusic(){
  var audio = $("#Audio"+current_audio_id);
  audio[0].pause();
}

function displaySubmitAudio(){
  $('#submitAudio').show();
}

$('#musiqueSelectForm').submit(function (e) {
  e.preventDefault();
  toggleAudio();
  stopSelectedMusic();
  return false;
 });

/********************* ajout de texte ****************************/

$(document).on('submit','#modalTextForm', function(e){
  populateText();
  closeBsModal();
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
  console.log(current_block_id);
}

/**ajout dynamique de texte */
function populateText(){
  var user_text = $("#toFill").val();
  $('#'+current_block_id).find('.to-populate').html(user_text);
  $('#trigger'+current_block_id).addClass('filled-block');
}


/**************
  * Functions*
****************/

  
/*reset à la fermeture des modals*/
function resetCurrentBlockValue(){
  current_block_id = null;
}

function closeBsModal(){
  $('#createContentModal').modal('hide');
  resetCurrentBlockValue();
  resetTextArea();
}

function resetTextArea(){
  $('#modalTextFormContainer').froalaEditor('html.set', '');
}

/*couleur arrière-plan*/
function changeBgColor(){
  var color = $("#colorPicker").spectrum("get");
  document.getElementById("createBody").style.backgroundColor = color;
}

function changeBgOpacity(){
  var bgopacity = $("#opacityRange").val();
  $("#createBody").css('opacity', bgopacity/100);
}

/*Upload image*/
document.getElementById('imagePicker').addEventListener('change', readURL, true);
function readURL(){
  console.log("test");
    var file = document.getElementById("imagePicker").files[0];
    var reader = new FileReader();
    reader.onloadend = function(){
        document.getElementById('createBody').style.backgroundImage = "url(" + reader.result + ")";        
    }
    if(file){
        reader.readAsDataURL(file);
    }else{
      return false();
    }
}

/* ajout image à block */
document.getElementById('addImageContent').addEventListener('change', readBlockURL, true);
function readBlockURL(){
    var file = document.getElementById("addImageContent").files[0];
    var reader = new FileReader();
    reader.onloadend = function(){
      $('#trigger'+current_block_id).removeClass("removed-content");
      document.getElementById('trigger'+current_block_id).style.border ="none";  
      document.getElementById('trigger'+current_block_id).style.backgroundImage = "url(" + reader.result + ")";  
      document.getElementById('trigger'+current_block_id).style.backgroundSize = "cover";  
      document.getElementById('trigger'+current_block_id).style.backgroundPosition = "center";  
      document.getElementById('content-added'+current_block_id).style.display ="inline-block";  
    }
    if(file){
        reader.readAsDataURL(file);
    }else{
      return false();
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

  function toggleAudio(){
    var x = document.getElementById("musiqueContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  
  function imageGalleryContainerToggle(){
    var x = document.getElementById("imageGalleryContainer");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

/*suppression image block*/
  function removeContent(){
    document.getElementById('trigger'+current_block_id).style.backgroundImage = "";  
    document.getElementById('trigger'+current_block_id).style.backgroundSize = "";  
    document.getElementById('trigger'+current_block_id).style.backgroundPosition = "";  
    document.getElementById('trigger'+current_block_id).style.border = "";  
    document.getElementById('content-added'+current_block_id).style.display ="none";  
    resetBlockContent();

  }
  
  function resetBlockContent(){
    $('#trigger'+current_block_id).addClass("removed-content");
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

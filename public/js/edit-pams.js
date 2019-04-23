/**récuparation des variables */
$( document ).ready(function() {

    document.getElementById("publicationPopup").style.display = "block";
    $('#updateLink').removeAttr('href');

    /*var pamsJson =  pamsJs;*/
    console.log(pamsJson);
    var disposition = pamsJson.layout;
    var backgroundColor = pamsJson.backgroundColor;
    var backgroundOpacity = pamsJson.backgroundOpacity
    var backgroundImage = pamsJson.backgroundImage;
    var uploadedBackgroundImage = pamsJson.uploadedbackgroundImage;
    var blockText = pamsJson.addedblockText;
    var uploadMusic = pamsJson.uploadedAudio;
    var blockImages = pamsJson.uploadedblockImage;
    var blockVideos = pamsJson.uploadedblockVideos;
    var blockCitations = pamsJson.addedblockCitation;
    var chooseAudio = pamsJson.music;
    var chapitreJson = pamsJson.chapitre;

    /*initialisation des variables*/
    var current_block_id = null;
    var current_audio_id = null;
    var current_image_id = null;
    var current_layout_value = null;
    var playing = false;

    var send_layout_value = disposition;
    var send_background_color = backgroundColor;
    var send_opacity_value = backgroundOpacity;
    var send_image_id = backgroundImage;
    var send_background_image_uploaded = null;
    var send_uploaded_audio = uploadMusic;
    var send_audio_id = chooseAudio;
    var send_chapitre_value = 1;

    /**récupérer le text */
    if ( blockText !== undefined){
        Object.keys(pamsJson.addedblockText);
        var textObj = pamsJson.addedblockText;
        var textKeys = Object.keys(pamsJson.addedblockText);
    }else{
        blockText = {};
    }

    /**récupérer les citations */
    if ( blockCitations !== undefined){
        Object.keys(pamsJson.addedblockCitation);
        var citationObj = pamsJson.addedblockCitation;
        var citationKeys = Object.keys(pamsJson.addedblockCitation);
    }else{
        blockCitations = {};
    }

    /**récupérer les images ajoutées aux blocks */
    if (blockImages !== undefined){
        Object.keys(pamsJson.uploadedblockImage);
        var imageObj = pamsJson.uploadedblockImage;
        var imageKeys = Object.keys(pamsJson.uploadedblockImage);
    }else{
        blockImages = {};
    }

    /**récupérer les vidéos ajoutées aux blocks */
    if (blockVideos !== undefined){
        Object.keys(pamsJson.uploadedblockVideos);
        var vidObj = pamsJson.uploadedblockVideos;
        var vidKeys = Object.keys(pamsJson.uploadedblockVideos);
    }else{
        blockVideos = {};
    }

    if (chapitreJson !== 1){
        var send_chapitre = chapitreJson;
    }

    defineDisposition(disposition);
    defineBackgroundColor(backgroundColor, backgroundOpacity);

    if (chooseAudio !== null){
        chooseMusic(chooseAudio);
        displayAudioElement();
    }

    if (uploadMusic !== undefined){
        defineUploadedMusic(uploadMusic);
        displayAudioElement();
    }

    if (textObj !== null){
        addBlockTextContent(textObj, textKeys);
    }

    if (imageObj !== null){
        addImageContent(imageObj, imageKeys);
    }

    if (vidObj !== null){
        addVideoContent(vidObj, vidKeys);
    }

    if (citationObj !== null){
        addBlockCitation(citationObj, citationKeys);
    }

    if ( backgroundImage !== null){
        defineBackgroundImage(backgroundImage);
    }

    if (uploadedBackgroundImage !== undefined){
        setUploadedBackgroundImage(uploadedBackgroundImage);
    }

    
/*opacity & colorpicker*/

$("#colorPicker").spectrum({
    preferredFormat: "hex",
    flat: true,
    showInput: true,
    showAlpha: true,
    allowEmpty: true
});

var slider = document.getElementById("opacityRange");
var output = document.getElementById("opacityValue");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
    send_opacity_value = output.innerHTML;
}

/*events*/

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()
   
});


$("#bodyBackdrop").click(function (event) {
    event.stopPropagation();
    resetAllPopups();
});


$(document).on('click', '.updatePopup', function () {
    updatePopupShow();
    return false;
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
    closeCitationsContainer();
    return false;
});


$(document).on('click', '#imageGalleryToggleLabel', function () {
    imageGalleryContainerToggle();
    return false;
});

$(document).on('click', '#faqToggle', function () {
    faqContainerToggle();
    return false;
});


$(document).on('click', '#citationsToggle', function () {
    citationsContainerToggle();
    closeTextFormModal();
    return false;
});


$(document).on('click', '#citationsLibraryContainerToggle', function () {
   /* $("#citationsForm").hide();*/
    citationsLibraryToggle();
    citationsFormContainerToggle();
    return false;
});

$(document).on('click', '#citationsLibraryContainerToggle2', function () {
    /* $("#citationsForm").hide();*/
     citationsLibraryToggle();
     citationsFormContainerToggle();
     return false;
 });
 


/**Toggle tempsréel des layouts***/
$(document).on('change', '.input-disposition', function (e) {
    var $this = $(this);
    var current_layout_value = $this.val();
    send_layout_value = current_layout_value;
    toggleDisposition(current_layout_value);
});

$(document).on('change', '#colorPicker', function (e) {
    changeBgColor();
    return false;
});

$(document).on('change', '#opacityRange', function (e) {
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
$('.content-added').click(function () {
    findModalBlock(this);
    removeContent();
});

/*******************************************
 **** Widget choix de l'image de fond*********
 *******************************************/

/*cibler la vignette musique*/
$('.image-list-item').on('click', function (e) {
    var $this = $(this);
    var li_id = $this.attr('id');
    current_image_id = li_id;
    send_image_id = current_image_id;
    chooseImage();
});


function chooseImage() {
    var file = $('#' + current_image_id + 'input').val();
    document.getElementById('createBody').style.backgroundImage = "url(" + file + ")";
}

function clearImage() {
    document.getElementById('createBody').style.backgroundImage = "none";
}

/*ajouter sélecteur image*/
$('.image-list-item img').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $current = $('.selected-image');
    $current.removeClass('selected-image');
    clearImage();
    if (!$this.is($current)) {
        $this.addClass('selected-image');
    }
});


$('#bgImageForm').submit(function (e) {
    resetImageId();
    imageGalleryContainerToggle();
    backgroundPopupToggle();
    return false;
});

$('#sendDataSubmit').on('click', function (e) {
    sendData();
});

$('#seePams').on('click', function (e) {
    sendData();
});


function resetImageId() {
    current_image_id = null;
}


/*******************************************
 ******* Widget choix de la musique*********
 *******************************************/

$('#musiqueSelect').change(function () {
    var criteria = $(this).val();
    if (criteria == 'ALL') {
        $('.lilist').show();
        return;
    }
    $('.categorie').each(function (i, option) {
        if ($(this).html() == criteria) {
            $(this).parent().show();
        } else {
            $(this).parent().hide();
        }
    });
});

$('#musiqueUploader').change(function () {
    var sound = document.getElementById('sound');
    var reader = new FileReader();
    sound.src = URL.createObjectURL(this.files[0]);
    reader.readAsDataURL(this.files[0]); 
    reader.onloadend = function() {
        send_uploaded_audio = reader.result;                
        console.log(send_uploaded_audio);
    }
    sound.onend = function (e) {
        URL.revokeObjectURL(this.src);
    }

});

$(document).on('click', '.music-list-item', function (e) {
    findMusicId(this);
});

/*cibler la vignette musique*/
function findMusicId(elementClicked) {
    var $this = $(elementClicked); // on récup l'élément cliqué en jQuery
    $this.off("click");
    var $li = $this.closest('.music-list-item') // ça récupère l'élément le plus proche avec cette classe (le bloc parent dans l'idée)
    var li_id = $li.attr('id');
    current_audio_id = li_id;
    send_audio_id = current_audio_id;
    playSelectedMusic();
    chooseMusic();
}


function chooseMusic() {
    var audiofile = $('#' + current_audio_id + 'input').val();
    document.getElementById('sound').src = "/audio/" + audiofile + "";
}


/*ajouter sélecteur musique*/
$('.music-list-item img').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $current = $('.selected-audio');
    $current.removeClass('selected-audio');
    if (!$this.is($current)) {
        $this.addClass('selected-audio');
    }
    displaySubmitAudio();
    playSelectedMusic();
});


function playSelectedMusic() {
    var audio = $("#Audio" + current_audio_id);
    if (playing == false) {
        audio[0].play();
        playing = true;
    } else {
        audio[0].pause();
        playing = false;
    }
}

function stopSelectedMusic() {
    var audio = $("#Audio" + current_audio_id);
    audio[0].pause();
}

function displaySubmitAudio() {
    $('#submitAudio').show();
}

$('#musiqueSelectForm').submit(function (e) {
    e.preventDefault();
    toggleAudio();
    stopSelectedMusic();
    return false;
});

$('#publicationPopupEmailForm').submit(function (e) {
    e.preventDefault();
});




/********************* ajout de texte ****************************/

$(document).on('submit', '#modalTextForm', function (e) {
    e.preventDefault();
    populateText();
    closeBsModal();
    return false;
});

$('#citationsForm').on('submit', function (e) {
    e.preventDefault();
    populateCitation();
    closeBsModal();
    return false;
});


$('#citationsLibraryForm').on('submit', function (e) {
    e.preventDefault();
    populateCitationLibrary();
    closeBsModal();
    return false;
});

$(document).on('click', '.trigger-modal-block', function (e) {
    findModalBlock(this);
});

function findModalBlock(elementClicked) {
    var $this = $(elementClicked);
    var $block = $this.closest('.createContent')
    var block_id = $block.attr('id');
    current_block_id = block_id;
    /* send_block_id = current_block_id;*/
}

/**ajout dynamique de texte wysiwyg*/
function populateText() {
    var user_text = $("#toFill").val();
    $('#' + current_block_id).find('.to-populate').html(user_text);
    $('#trigger' + current_block_id).addClass('filled-block');
    document.getElementById('trigger' + current_block_id).style.border = "none";
    document.getElementById('content-added' + current_block_id).style.display = "inline-block";
    $('#' + current_block_id).addClass('user-content');
    blockText[current_block_id] = user_text;
}
/**ajout dynamique de texte citation*/
function populateCitation() {
    var citation_text = $("#citationsTextFill").val();
    var citation_auteur = $("#citationsAuteurFill").val();
    var citation_infos = $("#citationsInfosFill").val();
    $('#' + current_block_id).find('.to-populate-citation').text("« "+citation_text+" »");
    $('#' + current_block_id).find('.to-populate-auteur').text(citation_auteur);
    $('#' + current_block_id).find('.to-populate-infos').text(citation_infos);
    $('#trigger' + current_block_id).addClass('filled-block');
    document.getElementById('trigger' + current_block_id).style.border = "none";
    document.getElementById('content-added' + current_block_id).style.display = "inline-block";
    $('#' + current_block_id).addClass('user-content');
    blockCitations[current_block_id] = {
        text: citation_text,
        auteur: citation_auteur,
        infos: citation_infos
    }
}

/*autoriser une seule checkbox*/

$('input.custom-control-input').on('change', function() {
    $('input.custom-control-input').not(this).prop('checked', false);  
});

function populateCitationLibrary() {
    var current_citation_check = $("input:checkbox[name=citationsCheckbox]:checked").attr("id");
    var citation_library_text = $("#"+current_citation_check+"Text").val();
    var citation_library_auteur = $("#"+current_citation_check+"Auteur").val();
    $('#' + current_block_id).find('.to-populate-citation').text(citation_library_text);
    $('#' + current_block_id).find('.to-populate-auteur').text(citation_library_auteur);
    $('#trigger' + current_block_id).addClass('filled-block');
    document.getElementById('trigger' + current_block_id).style.border = "none";
    document.getElementById('content-added' + current_block_id).style.display = "inline-block";
    $('#' + current_block_id).addClass('user-content');
    blockCitations[current_block_id] = {
        text: citation_library_text,
        auteur: citation_library_auteur,
    }
}
/**************
 * Functions*
 ****************/


/*reset à la fermeture des modals*/
function resetCurrentBlockValue() {
    current_block_id = null;
}

function closeBsModal() {
    $('#createContentModal').modal('hide');
    resetCurrentBlockValue();
    resetTextArea();
    closeContentModalOptions();
}

function resetTextArea() {
   /* $('#modalTextFormContainer').froalaEditor('html.set', '');*/
    tinymce.activeEditor.setContent('');
}

/*couleur arrière-plan*/
function changeBgColor() {
    var color = $("#colorPicker").spectrum("get");
    if (color !== null){
        send_background_color = color.toHexString() ;
    }
    document.getElementById("createBody").style.backgroundColor = color;
}

function changeBgOpacity() {
    var bgopacity = $("#opacityRange").val();
    $("#createBody").css('opacity', bgopacity / 100);
}

/*Upload image*/
document.getElementById('imagePicker').addEventListener('change', readURL, true);

function readURL() {
    clearImage();
    var file = document.getElementById("imagePicker").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        document.getElementById('createBody').style.backgroundImage = "url(" + reader.result + ")";
        send_background_image_uploaded = reader.result;
      }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        return false;
    }
}


/* ajout image à block */
document.getElementById('addImageContent').addEventListener('change', readBlockURL, true);
function readBlockURL() {
    var file = document.getElementById("addImageContent").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        $('#trigger' + current_block_id).removeClass("removed-content");
        $('#' + current_block_id).addClass('user-content');
        document.getElementById('trigger' + current_block_id).style.border = "none";
        document.getElementById('trigger' + current_block_id).style.backgroundImage = "url(" + reader.result + ")";
        document.getElementById('trigger' + current_block_id).style.backgroundSize = "cover";
        document.getElementById('trigger' + current_block_id).style.backgroundPosition = "center";
        document.getElementById('content-added' + current_block_id).style.display = "inline-block";
        blockImages[current_block_id] = reader.result;
        console.log(reader.result);
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        return false;
    }

}

/* ajout vidéo à block */
document.getElementById('addVideoContent').addEventListener('change', readVideoBlockurl, true);
function readVideoBlockurl() {
    var file = document.getElementById("addVideoContent").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        $('#trigger' + current_block_id).removeClass("removed-content");
        $('#' + current_block_id).addClass('user-content');
        document.getElementById('trigger' + current_block_id).style.border = "none";
        document.getElementById('trigger' + current_block_id).style.backgroundImage = "none";
        document.getElementById('trigger' + current_block_id).style.backgroundSize = "cover";
        document.getElementById('trigger' + current_block_id).style.backgroundPosition = "center";
        document.getElementById('content-added' + current_block_id).style.display = "inline-block";
        document.getElementById(current_block_id + 'Video').setAttribute('src', reader.result);
        document.getElementById(current_block_id + 'Video').style.display = "block";
        document.getElementById(current_block_id + 'VideoModal').setAttribute('src', reader.result);
        document.getElementById(current_block_id + 'VideoModal').style.display = "block";
        document.getElementById('trigger' + current_block_id).setAttribute('data-target', '');
        blockVideos[current_block_id] = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        return false;
    }
}

/**Gestion des popups*/
function resetAllPopups() {
    document.getElementById("imageGalleryContainer").style.display = "none";
    document.getElementById("FAQContainer").style.display = "none";
    document.getElementById("musiqueContainer").style.display = "none";
    document.getElementById("backgroundContainer").style.display = "none";
    document.getElementById("dispositionContainer").style.display = "none";
    document.getElementById("colorPickerContainer").style.display = "none";
    document.getElementById("modalTextFormContainer").style.display = "none";
    document.getElementById("publicationPopup").style.display = "none";
    document.getElementById("updatePopup").style.display = "none";
}

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

function toggleAudio() {
    var x = document.getElementById("musiqueContainer");
    if (x.style.display === "none") {
        x.style.display = "block";

    } else {
        x.style.display = "none";
    }
}

function imageGalleryContainerToggle() {
    var x = document.getElementById("imageGalleryContainer");
    if (x.style.display === "none") {
        x.style.display = "block";

    } else {
        x.style.display = "none";
    }
}

function faqContainerToggle() {
    var x = document.getElementById("FAQContainer");
    if (x.style.display === "none") {
        x.style.display = "block";

    } else {
        x.style.display = "none";
    }
}

function citationsContainerToggle() {
    document.getElementById("citationsLibraryContainer").style.display = "none";
    document.getElementById("citationsContainer").style.display = "block";
    var x = document.getElementById("citationsAllContainer");
    if (x.style.display === "none") {
        x.style.display = "block";

    } else {
        x.style.display = "none";
    }
}

function citationsFormContainerToggle() {
    var ly = document.getElementById("citationsContainer");
    if (ly.style.display === "none") {
        ly.style.display = "block";
    } else {
        ly.style.display = "none";
    }
}


function citationsLibraryToggle() {
    var ly = document.getElementById("citationsLibraryContainer");
    if (ly.style.display === "none") {
        ly.style.display = "block";
    } else {
        ly.style.display = "none";
    }
}

function publicationPopupContainerShow(){
    document.getElementById("publicationPopup").style.display = "block";
}

function updatePopupShow(){
    document.getElementById("updatePopup").style.display = "block";
}

function closeContentModalOptions(){
    document.getElementById("citationsContainer").style.display = "none";
    document.getElementById("citationsLibraryContainer").style.display = "none";
    document.getElementById("modalTextFormContainer").style.display = "none";
}

function closeCitationsContainer(){
    document.getElementById("citationsAllContainer").style.display = "none";
}

function closeTextFormModal(){
    document.getElementById("modalTextFormContainer").style.display = "none";
}



/*suppression contenu block*/
function removeContent() {
    $('#' + current_block_id).removeClass('user-content');
    document.getElementById('trigger' + current_block_id).style.backgroundImage = "";
    document.getElementById('trigger' + current_block_id).style.backgroundSize = "";
    document.getElementById('trigger' + current_block_id).style.backgroundPosition = "";
    document.getElementById('trigger' + current_block_id).style.border = "";
    document.getElementById('content-added' + current_block_id).style.display = "none";
    document.getElementById(current_block_id + 'Video').setAttribute('src', '');
    document.getElementById(current_block_id + 'VideoModal').setAttribute('src', '');
    document.getElementById(current_block_id + 'Video').style.display = "none";
    $('#' + current_block_id).find('.to-populate').html('');
    $('#' + current_block_id).find('.to-populate-citation').text('');
    $('#' + current_block_id).find('.to-populate-infos').text('');
    $('#' + current_block_id).find('.to-populate-auteur').text('');
    document.getElementById('trigger' + current_block_id).setAttribute('data-target', '#createContentModal');
    resetBlockContent();
    resetBlockVariables();
}


function resetBlockContent() {
    $('#' + current_block_id).removeClass('user-content');
    $('#trigger' + current_block_id).addClass("removed-content");
    $('#trigger' + current_block_id).removeClass('filled-block');
}

/*reset des variables*/
function resetBlockVariables(){
    delete blockVideos[current_block_id]; 
    delete blockImages[current_block_id];
    delete blockCitations[current_block_id];
    delete blockText[current_block_id];
}


/*Layouts*/
function toggleDisposition(disposition) {
    var $active = $('.disposition-active');
    var $target = $('#' + disposition);
    console.log(disposition);

    // Si la sélection est celle déjà active, on fait rien
    if ($target.is($active)) return false;

    // Si déjà une d'active
    if ($active.length > 0) {
        $active.removeClass('disposition-active');
    }
    $target.addClass('disposition-active');
}

/***CHAPITRES ****/
$('.input-chapitre').on('change', function() {
    $('.input-chapitre').not(this).prop('checked', false);  
});

$(document).on('change', '.input-chapitre', function (e) {
    var $this = $(this);
    var current_chapitre_value = $this.val();
    send_chapitre_value = current_chapitre_value;
    console.log("chapitre : " + current_chapitre_value);
    toggleChapitre(current_chapitre_value);
    /*getChapitre(send_chapitre_value);*/
});

function toggleChapitre(current_chapitre_value) {
    var $active = $('.chapitreActif');
    var $target = $('#chapitre' + current_chapitre_value );
    if ($target.is($active)) return false;
    if ($active.length > 0) {
        $active.closest('li').removeClass('chapitreActif');
    }
    $target.closest('li').addClass('chapitreActif');
}

$("#chapitreListShow").click(function(){
        $('#chapitreListHider').css({ 'height' : '+=52px' });
})

/***************************************
 * ************OBJET JSON **************
 * ************************************/


function sendData() {
    var obj = {
        'chapitre': send_chapitre_value,
        'backgroundOpacity': send_opacity_value,
        'backgroundColor': send_background_color,
        'backgroundImage': send_image_id,
        'music': send_audio_id,
        'layout': send_layout_value,
        'uploadedbackgroundImage': send_background_image_uploaded,
        'uploadedblockImage':  blockImages,
        'uploadedblockVideos': blockVideos,
        'addedblockText': blockText,
        'addedblockCitation': blockCitations,
        'uploadedAudio' : send_uploaded_audio,
    };
    console.log(obj);
    $.ajax({
        url: Routing.generate('pams_post'),
        async: true,
        type: 'POST',
        dataType: 'json',
        data: {
            'pams': JSON.stringify(obj)
        },
        success: function (result) {
            console.log(result);
        }
    });
}

/*
function getChapitre(send_chapitre_value){
    $.ajax({
        url: Routing.generate('pams_get'),
        data: {
            'chapitre': send_chapitre_value
        },
    success: function (result) {
            Pamsjson = result;
        }
    });
}*/

});

/*******initialisation du layout******************/
function defineDisposition(disposition) {
    var $active = $('.disposition-active');
    var $target = $('#' + disposition);
    if ($target.is($active)) return false;
    if ($active.length > 0) {
        $active.removeClass('disposition-active');
    }
    $target.addClass('disposition-active');
}

function defineBackgroundColor(backgroundColor, backgroundOpacity) {
    document.getElementById("createBody").style.backgroundColor = backgroundColor;
    document.getElementById("createBody").style.opacity = backgroundOpacity;
}

function defineBackgroundImage(backgroundImage, backgroundOpacity){
    var file = $('#' + backgroundImage + 'input').val();
    document.getElementById('createBody').style.backgroundImage = "url(" + file + ")";
    console.log(file);
}

function addBlockTextContent(textObj, textKeys){
    for (var textKeys in textObj){
        var user_text = textObj[textKeys];
        var current_block_text_id = textKeys;
        $('#' + current_block_text_id).find('.to-populate').html(user_text);
        $('#trigger' + current_block_text_id).addClass('filled-block');
        document.getElementById('trigger' + current_block_text_id).style.border = "none";
        $('#' + current_block_text_id).addClass('user-content');
        document.getElementById('content-added' + current_block_text_id).style.display = "inline-block";
    }
}

function addBlockCitation(citationObj, citationKeys){
    for (var citationKeys in citationObj){
        /*var user_citation = citationObj[citationKeys];*/
        var current_block_citation_id = citationKeys;
        var citation_text = citationObj[citationKeys].texte;
        var citation_auteur = citationObj[citationKeys].auteur;
        var citation_infos = citationObj[citationKeys].infos;
        $('#' + current_block_citation_id).find('.to-populate-citation').text("« "+citation_text+" »");
        $('#' + current_block_citation_id).find('.to-populate-auteur').text(citation_auteur);
        $('#' + current_block_citation_id).find('.to-populate-infos').text(citation_infos);
        $('#trigger' + current_block_citation_id).addClass('filled-block');
        document.getElementById('trigger' + current_block_citation_id).style.border = "none";
        $('#' + current_block_citation_id).addClass('user-content');
        document.getElementById('content-added' + current_block_citation_id).style.display = "inline-block";
    }
}


function setUploadedBackgroundImage(uploadedBackgroundImage){
    document.getElementById('createBody').style.backgroundImage = "url(" + uploadedBackgroundImage + ")";
}


function defineUploadedMusic(uploadMusic){
    var audiofile = uploadMusic;
    document.getElementById('sound').src = "" + audiofile + "";
}


function chooseMusic(chooseAudio){
    var audiofile = $('#' + chooseAudio + 'input').val();
    document.getElementById('sound').src = "/audio/" + audiofile + "";
}

function displayAudioElement(){
    document.getElementById('sound').style.display = "block";
}

function addImageContent(imageObj, imageKeys){
    for (var imageKeys in imageObj){
        var user_image = imageObj[imageKeys];
        var current_block_image_id = imageKeys;
        $('#' + current_block_image_id).addClass('user-content');
        document.getElementById('trigger' + current_block_image_id).style.border = "none";
        document.getElementById('trigger' + current_block_image_id).style.backgroundImage = "url(" + user_image + ")";
        document.getElementById('trigger' + current_block_image_id).style.backgroundSize = "cover";
        document.getElementById('trigger' + current_block_image_id).style.backgroundPosition = "center";
        document.getElementById('content-added' + current_block_image_id).style.display = "inline-block";
    }
}


function addVideoContent(vidObj, vidKeys){
    for (var vidKeys in vidObj){
        var user_video = vidObj[vidKeys];
        var current_block_video_id = vidKeys;
        $('#trigger' + current_block_video_id).removeClass("removed-content");
        $('#' + current_block_video_id).addClass('user-content');
        document.getElementById('trigger' + current_block_video_id).style.border = "none";
        document.getElementById('trigger' + current_block_id).style.backgroundImage = "none";
        document.getElementById('trigger' + current_block_video_id).style.backgroundSize = "cover";
        document.getElementById('trigger' + current_block_video_id).style.backgroundPosition = "center";
        document.getElementById(current_block_video_id + 'Video').setAttribute('src', user_video);
        document.getElementById(current_block_video_id + 'Video').style.display = "block";
        document.getElementById(current_block_video_id + 'VideoModal').setAttribute('src', user_video);
        document.getElementById(current_block_video_id + 'VideoModal').style.display = "block";
        document.getElementById('trigger' + current_block_video_id).setAttribute('data-target', '');
        document.getElementById('content-added' + current_block_video_id).style.display = "inline-block";
    }
}



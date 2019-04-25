/**récuparation des variables */
$( document ).ready(function() {

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

    /**récupérer le text */
    if ( blockText !== undefined){
        Object.keys(pamsJson.addedblockText);
        var textObj = pamsJson.addedblockText;
        var textKeys = Object.keys(pamsJson.addedblockText);
    }

    /**récupérer les citations */
    if ( blockCitations !== undefined){
        Object.keys(pamsJson.addedblockCitation);
        var citationObj = pamsJson.addedblockCitation;
        var citationKeys = Object.keys(pamsJson.addedblockCitation);
    }

    /**récupérer les images ajoutées aux blocks */
    if (blockImages !== undefined){
        Object.keys(pamsJson.uploadedblockImage);
        var imageObj = pamsJson.uploadedblockImage;
        var imageKeys = Object.keys(pamsJson.uploadedblockImage);
    }

    /**récupérer les vidéos ajoutées aux blocks */
    if (blockVideos !== undefined){
        Object.keys(pamsJson.uploadedblockVideos);
        var vidObj = pamsJson.uploadedblockVideos;
        var vidKeys = Object.keys(pamsJson.uploadedblockVideos);
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

});//end doc ready

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
        var current_block_id = textKeys;
        $('#' + current_block_id).find('.to-populate').html(user_text);
        $('#trigger' + current_block_id).addClass('filled-block');
        document.getElementById('trigger' + current_block_id).style.border = "none";
        $('#' + current_block_id).addClass('user-content');
    }
}

function addBlockCitation(citationObj, citationKeys){
    for (var citationKeys in citationObj){
        /*var user_citation = citationObj[citationKeys];*/
        var current_block_id = citationKeys;
        var citation_text = citationObj[citationKeys].texte;
        var citation_auteur = citationObj[citationKeys].auteur;
        var citation_infos = citationObj[citationKeys].infos;
        $('#' + current_block_id).find('.to-populate-citation').text("« "+citation_text+" »");
        $('#' + current_block_id).find('.to-populate-auteur').text(citation_auteur);
        $('#' + current_block_id).find('.to-populate-infos').text(citation_infos);
        $('#trigger' + current_block_id).addClass('filled-block');
        document.getElementById('trigger' + current_block_id).style.border = "none";
        $('#' + current_block_id).addClass('user-content');
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
        var current_block_id = imageKeys;
        $('#' + current_block_id).addClass('user-content');
        document.getElementById('trigger' + current_block_id).style.border = "none";
        document.getElementById('trigger' + current_block_id).style.backgroundImage = "url(" + user_image + ")";
        document.getElementById('trigger' + current_block_id).style.backgroundSize = "cover";
        document.getElementById('trigger' + current_block_id).style.backgroundPosition = "center";
    }
}


function addVideoContent(vidObj, vidKeys){
    for (var vidKeys in vidObj){
        var user_video = vidObj[vidKeys];
        var current_block_id = vidKeys;
        $('#trigger' + current_block_id).removeClass("removed-content");
        $('#' + current_block_id).addClass('user-content');
        document.getElementById('trigger' + current_block_id).style.border = "none";
        document.getElementById('trigger' + current_block_id).style.backgroundImage = "none";
        document.getElementById('trigger' + current_block_id).style.backgroundSize = "cover";
        document.getElementById('trigger' + current_block_id).style.backgroundPosition = "center";
        document.getElementById(current_block_id + 'Video').setAttribute('src', user_video);
        document.getElementById(current_block_id + 'Video').style.display = "block";
        document.getElementById(current_block_id + 'VideoModal').setAttribute('src', user_video);
        document.getElementById(current_block_id + 'VideoModal').style.display = "block";
        document.getElementById('trigger' + current_block_id).setAttribute('data-target', '');
    }
}

    
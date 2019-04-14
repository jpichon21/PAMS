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

    /*check
    console.log(disposition);
    console.log(backgroundColor);
    console.log(backgroundImage);
    console.log(blockText);
    console.log(uploadedBackgroundImage);
    console.log(uploadMusic);*/
    console.log(blockImages);

    /**récupérer le text */
    if ( blockText !== undefined){
        Object.keys(pamsJson.addedblockText);
        var textObj = pamsJson.addedblockText;
        var textKeys = Object.keys(pamsJson.addedblockText);
    }

    /**récupérer les images ajoutées aux blocks */
    if (blockImages !== undefined){
        Object.keys(pamsJson.uploadedblockImage);
        var imageObj = pamsJson.uploadedblockImage;
        var imageKeys = Object.keys(pamsJson.uploadedblockImage);
    }

    defineDisposition(disposition);
    defineBackgroundColor(backgroundColor, backgroundOpacity);

    if (textObj !== null){
        addBlockTextContent(textObj, textKeys);
    }

    if (imageObj !== null){
        addImageContent(imageObj, imageKeys);
    }

    if ( backgroundImage !== null){
        defineBackgroundImage(backgroundImage);
    }

    if (uploadedBackgroundImage !== undefined){
        setUploadedBackgroundImage(uploadedBackgroundImage);
    }

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
        var current_block_id = textKeys;
        $('#' + current_block_id).find('.to-populate').html(user_text);
        $('#trigger' + current_block_id).addClass('filled-block');
        document.getElementById('trigger' + current_block_id).style.border = "none";
        $('#' + current_block_id).addClass('user-content');
    }
}

function setUploadedBackgroundImage(uploadedBackgroundImage){
    document.getElementById('createBody').style.backgroundImage = "url(" + uploadedBackgroundImage + ")";
    console.log("ok");
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
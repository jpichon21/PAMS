/**récuparation des variables */
$( document ).ready(function() {

    var pamsJson = JSON.parse(pamsJs)
    console.log(pamsJson);
    var disposition = pamsJson.layout;
    var backgroundColor = pamsJson.backgroundColor;
    var backgroundOpacity = pamsJson.backgroundOpacity
    var backgroundImage = pamsJson.backgroundImage;
    var uploadedBackgroundImage = pamsJson.uploadedbackgroundImage;
    var blockText = pamsJson.addedblockText;

    /*check*/
    console.log(disposition);
    console.log(backgroundColor);
    console.log(backgroundImage);
    console.log(blockText);
    console.log(uploadedBackgroundImage);

    /**récupérer le text */
    if ( blockText !== undefined){
        Object.keys(pamsJson.addedblockText);
        var textObj = pamsJson.addedblockText;
        var textKeys = Object.keys(pamsJson.addedblockText);
    }

    defineDisposition(disposition);
    defineBackgroundColor(backgroundColor, backgroundOpacity);

    if (textObj !== null){
        addBlockTextContent(textObj, textKeys);
    }

    if ( backgroundImage !== null){
        defineBackgroundImage(backgroundImage);
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


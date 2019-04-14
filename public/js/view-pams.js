/**récuparation des variables */
$( document ).ready(function() {

    var pamsJson = JSON.parse(pamsJs)
    console.log(pamsJson);
    var disposition = pamsJson.layout;
    var backgroundColor = pamsJson.backgroundColor;
    var backgroundOpacity = pamsJson.backgroundOpacity
    var backgroundImage = pamsJson.backgroundImage;
    var uploadedbackgroundImage = pamsJson.uploadedbackgroundImage;
    var blockText = {};
    
    
    /*check*/
    console.log(disposition);
    console.log(backgroundColor);
    console.log(backgroundImage);

    defineDisposition(disposition);
    defineBackgroundColor(backgroundColor, backgroundOpacity);


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
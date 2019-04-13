/**récuparation des variables */
$( document ).ready(function() {

    var pamsJson = JSON.parse(pamsJs)
    var disposition = pamsJson.layout;
    var backgroundColor = pamsJson.backgroundColor;
    var backgroundOpacity = pamsJson.backgroundOpacity
    
    /*check*/
    console.log(disposition);
    console.log(backgroundColor);

    defineDisposition(disposition);
    defineBackgroundColor(backgroundColor, backgroundOpacity);

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
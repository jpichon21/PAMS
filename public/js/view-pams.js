
var disposition = obj.layout;

function define(disposition) {
    var $active = $('.disposition-active');
    var $target = $('#' + disposition);
    if ($target.is($active)) return false;

    // Si déjà une d'active
    if ($active.length > 0) {
        $active.removeClass('disposition-active');
    }
    $target.addClass('disposition-active');
}


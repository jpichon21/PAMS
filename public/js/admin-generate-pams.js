$(document).ready(function () {

    var interval = 0;

    $('#generate_link').click(function () {
        var number = parseInt($('#generate_number').val());
        var gpams = parseInt($('#generate_id_gpams').val());

        if (number > 0 && gpams > 0) {
            generatePams(number, gpams);
        }
        return false;
    });

    function generatePams(number, gpams) {
        $('#generate_form').hide();
        $('#generate-pams-progress').show();
        $.ajax({
            url: Routing.generate('admin_generate_pams_json'),
            data: {'number': number, 'id_gpams': gpams},
            type: 'POST',
            dataType: 'json',
            beforeSend: function () {
                interval = setInterval(getGeneratorPams, 1000);
            }
        }).done(function (datas) {
            if (datas.resultat) {
                var progress_bar = $('#generate-pams-progress').find('.progress-bar').first();
                progress_bar.css('width', '100%');
            }
        }).fail(function () {
        }).always(function () {
            clearInterval(interval);
        });
    }
    var xhr_getGeneratorPams;
    function getGeneratorPams() {
        var gpams = parseInt($('#generate_id_gpams').val());
        if (xhr_getGeneratorPams) {
            xhr_getGeneratorPams.abort();
        }
        xhr_getGeneratorPams = $.ajax({
            url: Routing.generate('admin_get_gpams_json'),
            data: {'id_gpams': gpams},
            type: 'POST',
            dataType: 'json'
        }).done(function (datas) {
            if (datas.resultat) {
                var progress_bar = $('#generate-pams-progress').find('.progress-bar').first();
                progress_bar.attr('aria-valuenow', datas.done).attr('aria-valuemax', datas.total).css('width', (Math.round((datas.done / datas.total) * 100)) + '%');
            }
        }).fail(function () {
        }).always(function () {
        });
    }
});
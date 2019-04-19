$(document).ready(function () {
    let allowSubmit = false;


    $('form[name="pams_entree"]').on("submit", function (event) {
        $("#check-error").hide();
        if (!allowSubmit) {

            event.preventDefault();

            $.ajax({
                url: Routing.generate('pams_check_code_valid'),
                data: {'data': JSON.stringify($(this).serializeArray())},
                success: function (result) {

                    if (result !== 'ok') {
                        $("#check-error").html(result);
                        $("#check-error").show();

                    } else {
                        allowSubmit = true;
                        $('form[name="pams_entree"]').submit();
                    }
                }
            });
        }
    });
});

var audio,
    video;
$(document).ready(function() {
    $(document).on("click", ".sound-volume", function() {
        if (audio.paused) {
            audio.play();
            $(this).find(".glyphicon").removeClass("glyphicon-volume-off").addClass("glyphicon-volume-up");
        } else {
            audio.pause();
            $(this).find(".glyphicon").removeClass("glyphicon-volume-up").addClass("glyphicon-volume-off");
        }
    });

    $(document).on("click", ".video-play", function() {
        video = $(this).closest(".block").find("video").first().get(0);
        if (video.paused) {
            $(this).find(".icon-play").addClass("hide").find(".glyphicon").first().removeClass("glyphicon-play").addClass("glyphicon-pause");
            $(this).find(".icon-play").hide();
            video.play();
        } else {
            $(this).find(".icon-play").removeClass("hide").find(".glyphicon").first().removeClass("glyphicon-pause").addClass("glyphicon-play");
            $(this).find(".icon-play").show();
            video.pause();
        }
    });

    $(".block-preview video").on("ended", function() {
        var icon_play = $(this).closest(".block").find(".icon-play").first();
        icon_play.find(".glyphicon").first().removeClass("glyphicon-pause").addClass("glyphicon-play");
        icon_play.show();
    });

    $(document).find("video").on("play", function() {
        audio.pause();
        $(".sound-volume").find(".glyphicon").removeClass("glyphicon-volume-up").addClass("glyphicon-volume-off");
    });
});
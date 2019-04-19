$(document).ready(function () {

    /**
     * Click events
     */

    $(document).on('click', '.btn-add', function () {
        closeMenuIfSmallDevise();
        var type = $(this).attr('data-type');
        addBlock(type);
        return false;
    });

    $(document).on('click', '.block-edit', function () {
        var block = $(this).closest('.block');
        displayEdition(block);
        return false;
    });

    $(document).on('click', '.block-delete', function () {
        var block = $(this).closest('.block');
        deleteBlock(block);
        return false;
    });

    $(document).on('click', '.block-save', function () {
        var block = $(this).closest('.block');
        saveBlock(block);
        return false;
    });

    $(document).on('click', '.block-cancel', function () {
        var block = $(this).closest('.block');
        cancelBlock(block);
        return false;
    });

    $(document).on('click', '#toggle-outils', function () {
        toggleMenuLeft();
        return false;
    });

    $(document).on('click', '.icon-play', function () {
        var video = $(this).closest('.block').find('video').first().get(0);
        if (video.paused) {
            video.play();
            $(this).hide();
            $(this).find('.glyphicon').first().removeClass('glyphicon-play').addClass('glyphicon-pause');
        } else {
            video.pause();
            $(this).show();
            $(this).find('.glyphicon').first().removeClass('glyphicon-pause').addClass('glyphicon-play');
        }
    });

    $(document).on('click', '.slider-picture-delete', function () {
        var picture = $(this).closest('.slider-picture');
        deletePictureFromSlider(picture);
        return false;
    });

    $(document).on('click', '#toggle-offline', function() {
        setOffline();
        return false;
    });
    
    $(document).on('click', '#toggle-online', function() {
        setOnline();
        return false;
    });

    $(document).on('click', '#delete-music-custom', function() {
        deleteMusicCustom($(this).closest('form'));
        return false;
    });

    $(document).on('click', '.alert-top-close', function () {
        $('.alert-top').hide();
    });

    /**
     * Change events
     */

    $(document).on('change', '#input_pams_music', function () {
        activateMusic();
    });

    $(document).on('change', 'input[name="model"]:checked', function () {
        var value = $(this).val();
        updateModel(value);
    });

    $(document).on('change', '.model-preview input[type="radio"]:checked', function (e) {
        $('.model-preview').removeClass("selected");
        $(this).parents('.model-preview').addClass("selected");
    });

    $(document).on('change', '.picture-uploader-input', function () {
        uploadPicture($(this).closest('form'));
    });

    $(document).on('change', '.video-uploader-input', function () {
        uploadVideo($(this).closest('form'));
    });

    $(document).on('change', '.slider-uploader-input', function () {
        uploadSlider($(this).closest('form'));
    });
    
    $(document).on('change', '.music-custom-uploader-input', function () {
        uploadMusicCustom($(this).closest('form'));
    });

    /**
     * Keyup events
     */

//    $(document).on('keyup', '#pams_title', function () {
//        updateTitle();
//    });

    /**
     * Ended events
     */

    $('.block-preview video').on('ended', function () {
        var icon_play = $(this).closest('.block').find('.icon-play').first();
        icon_play.show();
        icon_play.find('.glyphicon').first().removeClass('glyphicon-pause').addClass('glyphicon-play');
    });

    /**
     * notification
     */
    var notificationEmail;
    $("input#notification-email:first")
      .on("keyup change paste cut", function() {
        notificationEmail = $(this).val().trim();
      })
      .on("blur", function() {
        updateNotificationEmail();
      });

    /**
     * Functions
     */

    function $_GET(param) {
        var vars = {};
        window.location.href.replace(location.hash, '').replace(
                /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
                function (m, key, value) { // callback
                    vars[key] = value !== undefined ? value : '';
                }
        );

        if (param) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }

    function initSortable() {
        $("#blocks-container").sortable({
            handle: ".block-handle",
            placeholder: "block-placeholder",
            items: "div.block",
            update: function (event, ui) {
                updatePositionBlock(ui.item);
            }
        });
        $("#blocks-container").enableSelection();
    }

    var btnToggleOutils = $("#toggle-outils");
    function toggleMenuLeft() {
        if ($("#fly-menu-left").attr("closed") === "on") {
            $("#fly-menu-left").animate({
                marginLeft: '+=340px'
            }, 500, function(){
                btnToggleOutils.find("i").removeClass("glyphicon-pencil").addClass("glyphicon-chevron-left");;
                $("#fly-menu-left").attr("closed", "off");
            });
        } else {
            $("#fly-menu-left").animate({
                marginLeft: '-=340px'
            }, 500, function(){
                btnToggleOutils.find("i").removeClass("glyphicon-chevron-left").addClass("glyphicon-pencil");
                $("#fly-menu-left").attr("closed", "on");
            });
        }
    }

    function displayEdition(block) {
        block.find('.block-preview').first().hide();
        block.find('.block-edition').first().show();
    }

    function displayPreview(block) {
        block.find('.block-edition').first().hide();
        block.find('.block-preview').first().show();
    }

    function deletePictureFromSlider(picture) {
        picture.remove();
    }

    function addBlock(type) {
        $.ajax({
            url: Routing.generate('pams_add_block'),
            data: {'p': $_GET('p'), 'type': type},
            type: 'POST',
            dataType: 'json'
        }).done(function (datas) {
            if (datas.resultat) {
                $('#blocks-container').append(datas.html);
                var offset = $('.block').last().offset().top;
                $('html, body').animate({scrollTop: offset}, 'slow');
            }
        }).fail(function () {
        }).always(function () {
        });
    }

    function saveBlock(block) {
        var type = block.attr('data-type');
        switch (type) {
            case "text":
                saveBlockText(block);
                break;
            case "picture":
                saveBlockPicture(block);
                break;
            case "video":
                saveBlockVideo(block);
                break;
            case "slider":
                saveBlockSlider(block);
                break;
            case "link":
                saveBlockLink(block);
                break;
        }
    }

    function saveBlockText(block) {
        var id_block = block.attr('data-id');
//      var text = $("#editor_" + id_block).Editor("getText");
        var text = tinymce.editors["editor_" + id_block].getContent();
        $.ajax({
            url: Routing.generate('pams_save_block_text'),
            data: {'p': $_GET('p'), 'id_block': id_block, 'text': text},
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                block.find('.block-loading').show();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                block.replaceWith(datas.html);
            }
        }).fail(function () {
        }).always(function () {
            block.find('.block-loading').hide();
        });
    }

    function saveBlockPicture(block) {
        var id_block = block.attr('data-id');
        var form = block.find('form').first();
        var src = form.find('.picture-uploader-src').first().val();
        var name = form.find('.picture-uploader-name').text();
        if (src && name) {
            $.ajax({
                url: Routing.generate('pams_save_block_picture'),
                data: {'p': $_GET('p'), 'id_block': id_block, 'src': src, 'name': name, 'rotate': angle},
                type: 'POST',
                dataType: 'json',
                beforeSend: function (xhr) {
                    block.find('.block-loading').show();
                }
            }).done(function (datas) {
                if (datas.resultat) {
                    block.replaceWith(datas.html);
                }
            }).fail(function () {
            }).always(function () {
                angle = 0;
                block.find('.block-loading').hide();
            });
        }
    }

    function saveBlockVideo(block) {
        var id_block = block.attr('data-id');
        var form = block.find('form').first();
        var src = form.find('.video-uploader-src').first().val();
        var name = form.find('.video-uploader-name').text();
        if (src && name) {
            $.ajax({
                url: Routing.generate('pams_save_block_video'),
                data: {'p': $_GET('p'), 'id_block': id_block, 'src': src, 'name': name},
                type: 'POST',
                dataType: 'json',
                beforeSend: function (xhr) {
                    block.find('.block-loading').show();
                }
            }).done(function (datas) {
                if (datas.resultat) {
                    block.replaceWith(datas.html);
                }
            }).fail(function () {
            }).always(function () {
                block.find('.block-loading').hide();
            });
        }
    }

    function saveBlockSlider(block) {
        var id_block = block.attr('data-id');
        var pictures = [];
        var slider_pictures = block.find('.slider-pictures').first();
        slider_pictures.find('.slider-picture').each(function(index) {
            var src = $(this).find('.slider-picture-src').first().val();
            var name = $(this).find('.slider-picture-name').first().text();
            if(src && name) {
                pictures.push({'src': src, 'name': name});
            }
        });
        $.ajax({
            url: Routing.generate('pams_save_block_slider'),
            data: {'p': $_GET('p'), 'id_block': id_block, 'pictures': pictures},
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                block.find('.block-loading').show();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                block.replaceWith(datas.html);
            }
        }).fail(function () {
        }).always(function () {
            block.find('.block-loading').hide();
        });
    }

    function saveBlockLink(block) {
        var idBlock = block.data("id"),
            url = $("#editor-link-url-" + idBlock).val(),
            text = tinymce.editors["editor-link-text-" + idBlock].getContent();
        $.ajax({
            url: Routing.generate("pams_save_block_link"),
            data: {"p": $_GET("p"), "id_block": idBlock, "url": url, "text": text},
            type: "POST",
            dataType: "json",
            beforeSend: function(xhr) {
                block.find(".block-loading").show();
            }
        }).done(function(datas) {
            if (datas.resultat) {
                block.replaceWith(datas.html);
            } else if (datas.error) {
                alert(datas.error);
            }
        }).fail(function() {
        }).always(function() {
            block.find(".block-loading").hide();
        });
    }

    function cancelBlock(block) {
        var id_block = block.attr('data-id');
        $.ajax({
            url: Routing.generate('pams_cancel_block'),
            data: {'p': $_GET('p'), 'id_block': id_block},
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                block.find('.block-loading').show();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                block.replaceWith(datas.html);
            }
        }).fail(function () {
        }).always(function () {
            block.find('.block-loading').hide();
        });
    }

    function deleteBlock(block) {
        $.ajax({
            url: Routing.generate('pams_delete_block'),
            data: {'p': $_GET('p'), 'id_block': block.attr('data-id')},
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                block.find('.block-loading').show();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                if ("text" === block.attr('data-type')) {
                    tinymce.remove("#" + block.attr('data-id'));
                }
                $('.block[data-id="' + block.attr('data-id') + '"]').remove();
            }
        }).fail(function () {
        }).always(function () {
            block.find('.block-loading').hide();
        });
    }

    function uploadSlider(form) {
        var block = form.closest('.block');
        var input = form.find('.slider-uploader-input').first();
        var button = form.find('.slider-uploader-btn').first();
        var progress = form.find('.progress').first();
        var progressBar = progress.find('.progress-bar').first();
        var slider_pictures = block.find('.slider-pictures').first();
        var data = new FormData();
        $(input[0].files).each(function(i, file) {
            data.append('file[' + i + ']', file);
        });
        data.append('p', $_GET('p'));
        $.ajax({
            url: Routing.generate('pams_upload_picture'),
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                button.hide();
                progress.show();
                progressBar.css('width', '0%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.addEventListener("progress", function (e) {
                    progressBar.css('width', e.loaded / e.total * 100 + '%');
                }, false);
                return xhr;
            }
        }).done(function (datas) {
            progressBar.css('width', '100%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            if (datas.resultat) {
                var html = "";
                $(datas.files).each(function(i, file){
                    html += '<div class="col-md-3 slider-picture"><img width="100%" class="slider-uploader-thumb" src="/uploads/' + file.hash + '/pictures/' + file.src + '"><input class="slider-picture-src" type="hidden" value="' + file.src + '"><br><span class="slider-picture-name">' + file.name + '</span><br><div class="btn btn-danger slider-picture-delete"><span class="glyphicon glyphicon-remove"></span></div></div>';
                });
                slider_pictures.append(html);
            } else {
                $('#top_error p').text(datas.erreur);
                $('#top_error').fadeIn();
            }

        }).fail(function () {
            progressBar.css('width', '100%').removeClass('progress-bar-success').addClass('progress-bar-danger');
        }).always(function () {
            progress.hide();
            button.show();
        });
    }

    function uploadPicture(form) {
        var block = form.closest('.block');
        var input = form.find('.picture-uploader-input').first();
        var button = form.find('.picture-uploader-btn').first();
        var progress = form.find('.progress').first();
        var progressBar = progress.find('.progress-bar').first();
        var name = form.find('.picture-uploader-name').first();
        var thumb = form.find('.picture-uploader-thumb').first();
        var src = form.find('.picture-uploader-src').first();
        var file = input[0].files[0];
        var data = new FormData();
        data.append('file', file);
        data.append('p', $_GET('p'));
        $.ajax({
            url: Routing.generate('pams_upload_picture'),
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                button.hide();
                progress.show();
                progressBar.css('width', '0%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.addEventListener("progress", function (e) {
                    progressBar.css('width', e.loaded / e.total * 100 + '%');
                }, false);
                return xhr;
            }
        }).done(function (datas) {
            progressBar.css('width', '100%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            if (datas.resultat) {
                name.text(datas.files[0].name);
                thumb.attr('src', '/uploads/' + datas.files[0].hash + '/pictures/' + datas.files[0].src).show();
                src.val(datas.files[0].src);
                form.find('#uploading-thumb').first().hide();
                form.find('#uploaded-thumb').first().show();
            } else {
                $('#top_error p').text(datas.erreur);
                $('#top_error').fadeIn();
            }

        }).fail(function () {
            progressBar.css('width', '100%').removeClass('progress-bar-success').addClass('progress-bar-danger');
        }).always(function () {
            progress.hide();
            button.show();
        });
    }

    function uploadVideo(form) {
        var block = form.closest('.block');
        var input = form.find('.video-uploader-input').first();
        var button = form.find('.video-uploader-btn').first();
        var progress = form.find('.progress').first();
        var progressBar = progress.find('.progress-bar').first();
        var name = form.find('.video-uploader-name').first();
        var thumb = form.find('.video-uploader-thumb').first();
        var src = form.find('.video-uploader-src').first();
        var file = input[0].files[0];
        var data = new FormData();
        data.append('file', file);
        data.append('p', $_GET('p'));
        $.ajax({
            url: Routing.generate('pams_upload_video'),
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                button.hide();
                progress.show();
                progressBar.css('width', '0%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.addEventListener("progress", function (e) {
                    progressBar.css('width', e.loaded / e.total * 100 + '%');
                }, false);
                return xhr;
            }
        }).done(function (datas) {
            progressBar.css('width', '100%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            if (datas.resultat) {
                name.text(datas.name);
                thumb.find('source').first().attr('src', '/uploads/' + datas.hash + '/videos/' + datas.src);
                thumb.show();
                thumb.load();
                src.val(datas.src);
            } else {
                $('#top_error p').text(datas.erreur);
                $('#top_error').fadeIn();
            }

        }).fail(function () {
            progressBar.css('width', '100%').removeClass('progress-bar-success').addClass('progress-bar-danger');
        }).always(function () {
            progress.hide();
            button.show();
        });
    }
    
    function uploadMusicCustom(form) {
        var input = form.find('.music-custom-uploader-input').first();
        var button = form.find('.music-custom-uploader-btn').first();
        var progress = form.find('.progress').first();
        var progressBar = progress.find('.progress-bar').first();
        var name = form.find('.music-custom-uploader-name').first();
        var src = form.find('.music-custom-uploader-src').first();
        var file = input[0].files[0];
        var data = new FormData();
        data.append('file', file);
        data.append('p', $_GET('p'));
        $.ajax({
            url: Routing.generate('pams_upload_music_custom'),
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                button.hide();
                progress.show();
                progressBar.css('width', '0%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.addEventListener("progress", function (e) {
                    progressBar.css('width', e.loaded / e.total * 100 + '%');
                }, false);
                return xhr;
            }
        }).done(function (datas) {
            progressBar.css('width', '100%').removeClass('progress-bar-danger').addClass('progress-bar-success');
            if (datas.resultat) {
                name.html(datas.name + '<span id="delete-music-custom"><i class="glyphicon glyphicon-remove"></i></span>');
                src.val(datas.src);
            } else {
                $('#top_error p').text(datas.erreur);
                $('#top_error').fadeIn();
            }

        }).fail(function () {
            progressBar.css('width', '100%').removeClass('progress-bar-success').addClass('progress-bar-danger');
        }).always(function () {
            progress.hide();
            button.show();
        });
    }

    function updatePositionBlock(block) {
        var position = block.index();
        $.ajax({
            url: Routing.generate('pams_update_position_block'),
            data: {'p': $_GET('p'), 'id_block': block.attr('data-id'), 'position': position},
            type: 'POST',
            dataType: 'json'
        }).done(function (datas) {
            if (datas.resultat) {

            }
        }).fail(function () {
        }).always(function () {
        });
    }

    function activateMusic() {
        var music = ($('#input_pams_music').prop('checked') ? 1 : 0);
        $.ajax({
            url: Routing.generate('pams_activate_music'),
            data: {'p': $_GET('p'), 'music': music},
            type: 'POST',
            dataType: 'json'
        }).done(function (datas) {
            if (datas.resultat) {
                if(music) {
                    $('label[for="input_pams_music"]').find('.fa').first().removeClass('fa-square-o').addClass('fa-check-square-o');
                } else {
                    $('label[for="input_pams_music"]').find('.fa').first().removeClass('fa-check-square-o').addClass('fa-square-o');
                }
            }
        }).fail(function () {
        }).always(function () {
        });
    }

    var xhr;
    window.updateTitle = function() {
        if (xhr){
            xhr.abort();
        }
        var title = tinymce.editors["pams_title"].getContent();
        xhr = $.ajax({
            url: Routing.generate('pams_update_title'),
            data: {'p': $_GET('p'), 'title': title},
            type: 'POST',
            dataType: 'json',
            beforeSend: function(){
                $('.title-loading').show();
                $('#pams_title').hide();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                if (title !== ""){
                    $('#pams_title').removeClass('title-empty');
                }
                else{
                    $('#pams_title').addClass('title-empty');
                }
                $('#pams_title').html(title);
            }
        }).fail(function () {
        }).always(function () {
            $('.title-loading').hide();
            $('#pams_title').show();
        });
    };

    function updateModel(id) {
        $.ajax({
            url: Routing.generate('pams_update_model'),
            data: {'p': $_GET('p'), 'id_model': id},
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                $('#wrapper-loading').show();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                location.reload(true);
            } else {
                $('#wrapper-loading').hide();
            }
        }).fail(function () {
        }).always(function () {
        });
    }
    
    function setOnline() {
        $.ajax({
            url: Routing.generate('pams_set_online'),
            data: {'p': $_GET('p')},
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                $('#wrapper-loading').show();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                $('#pams-view').removeAttr("disabled");
                $('#toggle-offline').removeAttr("disabled");
            }
        }).fail(function () {
        }).always(function () {
            $('#wrapper-loading').hide();
        });
    }
    
    function setOffline() {
        $.ajax({
            url: Routing.generate('pams_set_offline'),
            data: {'p': $_GET('p')},
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                $('#wrapper-loading').show();
            }
        }).done(function (datas) {
            if (datas.resultat) {
                $('#pams-view').attr("disabled", "disabled");
                $('#toggle-offline').attr("disabled", "disabled");
            }
        }).fail(function () {
        }).always(function () {
            $('#wrapper-loading').hide();
        });
    }
    
    function deleteMusicCustom(form) {
        var name = form.find('.music-custom-uploader-name').first();
        var src = form.find('.music-custom-uploader-src').first();
        $.ajax({
            url: Routing.generate('pams_delete_music_custom'),
            data: {'p': $_GET('p')},
            type: 'POST',
            dataType: 'json'
        }).done(function (datas) {
            if (datas.resultat) {
                name.text('Par défaut');
                src.val('');
            }
        }).fail(function () {
        }).always(function () {
        });
    }

/*
 * Picture rotate 90°
 */
    var angle = 0;
    $(document).on("click", ".thumb-rotate-btn", function(){
        var id = $(this).data("thumb"),
            thumb = $("#thumb-"+id);
        angle += 90;
        if (angle > 270){
            angle = 0;
        }
        thumb.css("transform", "rotate(" + angle + "deg)");
    });

/*
 * Detection sceen
 */
    var isMobileDevise = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent),
        isSmallDevise = false,
        resizeEnd = (function() {
            var timers = {};
            return function(callback, ms, uniqueId) {
                if (!uniqueId){
                    uniqueId = "resized";
                }
                if (timers[uniqueId]) {
                    clearTimeout(timers[uniqueId]);
                }
                timers[uniqueId] = setTimeout(callback, ms);
            };
        })();
    if (true !== isMobileDevise) {
        $(window).resize(function(){
            resizeEnd(function(){
                closeMenuIfSmallDevise();
            }, 500, "resizing");
        });
    } else {
        $(document).find(".block-handle").hide();
    }
    function closeMenuIfSmallDevise(){
        if (true !== isMobileDevise && "on" !== $("#fly-menu-left").attr("closed")){
            isSmallDevise = window.matchMedia("screen and (max-width: 768px)").matches;
            if (true === isSmallDevise) {
                toggleMenuLeft();
            }
        }
    }

    var xhrNm;
    window.updateNotificationEmail = function() {
      if (xhrNm){
        xhrNm.abort();
      }
      xhrNm = $.ajax({
        url: Routing.generate("pams_update_notification_email"),
        data: {"p": $_GET('p'), "email": notificationEmail},
        type: "POST",
        dataType: "json",
        beforeSend: function(){
          $(".notification-email-input").hide();
          $(".notification-email-loading").show();
        }
      }).done(function (datas) {
        if (datas.resultat) {
          $(".notification-email-error").hide();
        } else {
          $(".notification-email-error > .message").html(datas.erreur);
          $(".notification-email-error").show();
        }
      }).fail(function () {
      }).always(function () {
        $(".notification-email-loading").hide();
        $(".notification-email-input").show();
      });
    };

    /**
     * Init
     */
    closeMenuIfSmallDevise();
    initSortable();

});
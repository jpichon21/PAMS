
$('.createContent').addClass('slideUp');


$( window ).on("load", function() {
    displayBlock1();
    setTimeout(displayBlock2,400);
    setTimeout(displayBlock3,800);
    setTimeout(displayBlock4,1200);
});

function displayBlock1(){
    $('.Block1').removeClass('slideUp');
    $('.Block1').addClass('createContentShow');
}

function displayBlock2(){
    $('.Block2').removeClass('slideUp');
    $('.Block2').addClass('createContentShow');

}

function displayBlock3(){
    $('.Block3').removeClass('slideUp');
    $('.Block3').addClass('createContentShow');
}

function displayBlock4(){
    $('.Block4').removeClass('slideUp');
    $('.Block4').addClass('createContentShow');
}






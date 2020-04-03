var server = "https://api."+window.location.host+"/";
var loader = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";

$( document ).ready(function() {
    // sessionStorage.removeItem('userData');

    // Cookies check
    compruebaAceptaCookies();

    // Carousel
    var randomSlide = Math.floor(Math.random() * $('#carouselThanks .carousel-indicators li').length);
    $('#carouselThanks').carousel(randomSlide);
    $('#carouselThanks').carousel('next');
});

function compruebaAceptaCookies() {
    if(localStorage.aceptaCookies == 'true'){
        cajacookies.style.display = 'none';
    }
}

function aceptarCookies() {
    localStorage.aceptaCookies = 'true';
    cajacookies.style.display = 'none';
}

var loader = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";

$( document ).ready(function() {
    // sessionStorage.removeItem('userData');
    compruebaAceptaCookies();
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

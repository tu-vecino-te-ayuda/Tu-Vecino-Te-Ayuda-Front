var server = "https://back.tuvecinoteayuda.org/";
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

function checkValues(key, value){
    var estado = '';

    switch(key){
        case 'name':
            if(value.length<3){
                estado = 'Error en: Nombre y Apellidos<br>';
            }
            break;
        case 'email':
            emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if(!emailRegex.test(value)){
                estado = 'Error en: Email<br>';
            }
            break;
        case 'phone':
            if(value.length<8 || value.length>12){
                estado = 'Error en: Teléfono<br>';
            }
            break;
        case 'password':
            tempPassword = value;
            if(value.length<8){
                estado = 'Error en: Contraseña<br>';
            }
            break;
        case 'password_confirmation':
            if(value.length<8 || value != tempPassword){
                estado = 'Error en: Las contraseñas son distintas<br>';
            }
            break;
        case 'nearby_areas_id':
            if(value == 0){
                estado = 'Error en: Preferencias de desplazamiento<br>';
            }
            break;
        case 'state':
            if(value == 0){
                estado = 'Error en: Provincia<br>';
            }
            break;
        case 'city':
            if(value == 0){
                estado = 'Error en: Ciudad<br>';
            }
            break;
        case 'address':
            if(value.length<5){
                estado = 'Error en: Dirección<br>';
            }
            break;
        case 'zip_code':
            if(value.length<5){
                estado = 'Error en: Código Postal<br>';
            }
            break;
        case 'cif':
            if(value.length<2){
                estado = 'Error en: CIF<br>';
            }
            break;
        case 'corporate_name':
            if(value.length<4){
                estado = 'Error en: Nombre de la Asociación<br>';
            }
            break;
        case 'check':
            if(value != 1){
                estado = 'Error en: Aceptar términos<br>';
            }
            break;
        case 'activity_areas_id':
            if(value == 0){
                estado = 'Error en: Área de actividad<br>';
            }
            break;
    }
    
    return estado;
}
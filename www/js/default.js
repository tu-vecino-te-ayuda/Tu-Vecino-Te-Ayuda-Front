var tempPassword = '';
$( document ).ready(function() {
    let urlParams = new URLSearchParams(window.location.search)

    sessionStorage.removeItem('userData');
    compruebaAceptaCookies();
    let ayudaprov = $('.ayuda-provincia');
    let ayudaciudad = $('.ayuda-ciudad');

    ayudaprov.empty();
    ayudaciudad.empty();

    ayudaprov.append('<option selected="true" value="0" disabled>--Seleccione provincia--</option>');
    ayudaprov.prop('selectedIndex', 0);

    ayudaciudad.append('<option selected="true" value="0" disabled>--Seleccione Ciudad--</option>');
    ayudaciudad.prop('selectedIndex', 0);

    $.each(provincias, function (key, entry) {
        ayudaprov.append($('<option></option>').attr('value', entry.id).text(entry.nm));
    })

    ayudaprov.change(function(){
        var id = $(this).val();

        ayudaciudad.empty();
        ayudaciudad.append('<option selected="true" value="0" disabled>--Seleccione Ciudad--</option>');
        ayudaciudad.prop('selectedIndex', 0);

        ayudaciudad.prop("disabled", false);

        $.each(ciudades, function (key, entry) {
            if(entry.id.substring(0,2) == id){
                ayudaciudad.append($('<option></option>').attr('value', entry.id).text(entry.nm));
            }
        })          
      });

    $("form").submit(function( event ) { 
        // grecaptcha.execute();
        event.preventDefault(); 
        var data = {};
        var errors = '';
        console.log(event);
        $.each(event.originalEvent.srcElement.elements, function(i, field) {
            // console.log(field.name + "->" + field.value);
            errors = errors + checkValues(field.name, field.value);
            data[field.name] = field.value;
        });
        console.log(errors);
        if(errors == ''){
            switch(event.target.id){
                case 'form-help':
                case 'form-vol':
                case 'form-ent':
                    postData(data, event);
                    break;
                case 'form-login':
                    login(data, event);
                    break;
                case 'form-recover':
                    recover(data, event);
                    break;
                case 'form-recovery':
                    recovery(data, event);
                    break;
            }
        }else{
            event.target.firstElementChild.innerHTML = errors;
        }
          
    });  
    var randomSlide = Math.floor(Math.random() * $('#carouselThanks .carousel-indicators li').length);
    $('#carouselThanks').carousel(randomSlide);
    $('#carouselThanks').carousel('next');

    if(urlParams.has('verified')){
        if(urlParams.get('verified')=='true'){
            $("#emailOk").removeClass("d-none");
        }else{
            $("#emailErr").removeClass("d-none");
        }
    }

    if(urlParams.has('email') && urlParams.has('token')){
        $("#email").val(urlParams.get('email'));
        $("#token").val(urlParams.get('token'));
    }
});

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


/** Services */

var loader = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";

function postData(data, event){
    event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/register',
        data : data,
        dataType: "json"
    }).then(function(data) {
        console.log(data);
        event.target.innerHTML = "Inscripción realizada con éxito, ya puedes acceder a la <a href='login.html'>zona privada</a>.";
    }).fail(function(data) {
        var errors = '';
        console.log(data);
        $.each(data.responseJSON.errors, function(i, field) {
            errors = errors + '<b>' + i + '</b>: ' + field + '<br>';
        });
        event.target.innerHTML = "Error en la inscripción, <a href='index.html'>intentelo de nuevo</a>.<br>"+errors;
    });
};


function login(data, event){
    event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/login',
        data : data,
        dataType: "json"
    }).then(function(data) {
        sessionStorage.setItem('userData', JSON.stringify(data));
        window.location.href="./dashboard.html";
    }).fail(function(data) {
        event.target.innerHTML = "<span class='text-secondary'>Error en la autenticación, <a href='login.html'>inténtelo de nuevo</a>.</span>";
    });
};


function recover(data, event){
    event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/password/email',
        data : data,
        dataType: "json"
    }).then(function(data) {
        $("#recoverOk").removeClass("d-none");
    }).fail(function(data) {
        $("#recoverErr").removeClass("d-none");
    });
};


function recovery(data, event){
    event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/password/email',
        data : data,
        dataType: "json"
    }).then(function(data) {
        $("#recoverOk").removeClass("d-none");
    }).fail(function(data) {
        $("#recoverErr").removeClass("d-none");
    });
};
    
/** Funciones */

function compruebaAceptaCookies() {
    if(localStorage.aceptaCookies == 'true'){
      cajacookies.style.display = 'none';
    }
  }

function aceptarCookies() {
    localStorage.aceptaCookies = 'true';
    cajacookies.style.display = 'none';
  }
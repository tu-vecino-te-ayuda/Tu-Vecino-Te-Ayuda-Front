var tempPassword = '';

$( document ).ready(function() {
    
    initValues();

    $('#form-help, #form-vol, #form-ent').submit(function( event ) {
    
        // Get data if it's validated
        var data = getDataForm(event);

        if ( data != null){
            postData(data);
        }

    });
});


/** Init State & City */
function initValues(){
    let ayudaprov = $('.ayuda-provincia');
    let ayudaciudad = $('.ayuda-ciudad');

    ayudaprov.empty();
    ayudaciudad.empty();

    ayudaprov.append('<option selected="true" value="" disabled>--Seleccione provincia--</option>');
    ayudaprov.prop('selectedIndex', 0);

    ayudaciudad.append('<option selected="true" value="" disabled>--Seleccione Ciudad--</option>');
    ayudaciudad.prop('selectedIndex', 0);

    $.each(provincias, function (key, entry) {
        ayudaprov.append($('<option></option>').attr('value', entry.id).text(entry.nm));
    })

    ayudaprov.change(function(){
        var id = $(this).val();

        ayudaciudad.empty();
        ayudaciudad.append('<option selected="true" value="" disabled>--Seleccione Ciudad--</option>');
        ayudaciudad.prop('selectedIndex', 0);

        ayudaciudad.prop("disabled", false);

        $.each(ciudades, function (key, entry) {
            if(entry.id.substring(0,2) == id){
                ayudaciudad.append($('<option></option>').attr('value', entry.id).text(entry.nm));
            }
        })          
      });
}

/** Info Status Fields Form */
(function() {
    'use strict';
    window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('needs-validation');
        Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

/** Data Form */
function getDataForm(event){
    // grecaptcha.execute();
    event.preventDefault(); 
    var data = {};
    var error = '';
    
    // Error Control
    $.each(event.originalEvent.srcElement.elements, function(i, field) {
        
        error = checkValues(field.name, field.value);
        
        // Delete old notifications
        $('.title-form .errorsNotification').remove()
        $('.title-form').append("<div class='errorsNotification'> <div>")
        
        if (error != ''){
            
            // Add new notification
            $('.title-form .errorsNotification').append("<p style='text-align:center; color:red'><strong>" + error + "</strong></p>");

            //Exit each
            return false
        }

        //Load Data
        data[field.name] = field.value;
    });


    // Warning CheckBox Legal
    let legal = $('#checkLegal').is(":checked");
    $('.user-form-check').css("color",legal ? "#212529" : "red");

    // Error First
    if (error != '' || !legal ) return null;
    
    // Validating All Data
    return data;
    
}

/** Check Values */
function checkValues(key, value){
    var estado = '';

    switch(key){
        case 'name':
            if(value.length<3){
                nameregex = /^[a-zA-Z ]+$/;
                if (!nameregex.test(value)){
                    estado = 'Error en: Nombre y Apellidos<br>';
                }
            }
            break;
        case 'email':
            emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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
            if(value == ''){
                estado = 'Error en: Preferencias de desplazamiento<br>';
            }
            break;
        case 'state':
            if(value == ''){
                estado = 'Error en: Provincia<br>';
            }
            break;
        case 'city':
            if(value == ''){
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
        case 'activity_areas_id':
            if(value == 0){
                estado = 'Error en: Área de actividad<br>';
            }
            break;
    }
       

    return estado;
}

/** Error Server */
function errorServer(data){
    //Reset Errors
    $('.title-form .errorsNotification').remove()
    $('.title-form').append("<div class='errorsNotification'> <div>")
    //Print Errors
    $.each(data, function(i, field) {
        $('.title-form .errorsNotification').remove()
        $('.title-form').append("<div class='errorsNotification'> <div>")
        $('.title-form .errorsNotification').append("<p style='text-align:center; color:red'>" + field + "</p>");
        $('input[name='+ i +']').focus();
        $('input[name='+ i +']').val("");
        return false;
    });
}

/** Services */
function postData(data){
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/register',
        data : data,
        dataType: "json"
    }).then(function(data) {
        window.location.href="./registro-confirmado";
    }).fail(function(data) {
        if (data.responseJSON && data.responseJSON.errors) {
            errorServer(data.responseJSON.errors);
        }
    });
};


var tempPassword = '';

$( document ).ready(function() {
    
    initValues();

    // Submit
    $('#form-help, #form-vol, #form-ent').submit(function( event ) {

        // Get data if it's validated
        var data = getDataForm(event);
        if ( data != null){
            postData(data);
        }

    });    
    
    // Check field on lost focus
    $( "input" ).blur(function() {
        checkValues(this.name, this.value);
    });

    // OnChange input text
    $('#form-help, #form-vol, #form-ent').on("input", function(){
        $(".error").remove();
        checkValues(this.name, this.value);
    });

});


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

/** Init State & City */
function initValues(){
    let ayudaprov = $('.ayuda-provincia');
    let ayudaciudad = $('.ayuda-ciudad');

    ayudaprov.empty();
    ayudaciudad.empty();

    ayudaprov.append('<option selected="true" value="" disabled>--Seleccione provincia--</option>');
    ayudaprov.prop('selectedIndex', 0);

    ayudaciudad.append('<option selected="true" value="" disabled>--Seleccione población--</option>');
    ayudaciudad.prop('selectedIndex', 0);

    $.each(provincias, function (key, entry) {
        ayudaprov.append($('<option></option>').attr('value', entry.id).text(entry.nm));
    })

    ayudaprov.change(function(){
        var id = $(this).val();

        ayudaciudad.empty();
        ayudaciudad.append('<option selected="true" value="" disabled>--Seleccione población--</option>');
        ayudaciudad.prop('selectedIndex', 0);

        ayudaciudad.prop("disabled", false);

        $.each(ciudades, function (key, entry) {
            if(entry.id.substring(0,2) == id){
                ayudaciudad.append($('<option></option>').attr('value', entry.id).text(entry.nm));
            }
        })          
      });
}

/** Data Form */
function getDataForm(event){

    var data = {};
    var error = '';
    grecaptcha.execute();
    event.preventDefault(); 
    
    // Check Values
    $.each(event.originalEvent.srcElement.elements, function(i, field) {
        error = checkValues(field.name, field.value);
        data[field.name] = field.value;
    });

    // Check Legal
    let legal = $('#checkLegal').is(":checked");
    $('.user-form-check').css("color",legal ? "#212529" : "red");
    $('.user-form-check').css("font-weight",legal ? "normal" : "bold");

    // If Error Or Not LegalCheck
    if (error != '' || !legal ) return null;

    // Validated Data
    return data;
    
}

/** Check Values */
function checkValues(key, value){
    var error = '';
    
    // If Select or undefined
    if (Number.isInteger(value) || value === undefined) return '';

    if (value.length === 0 && key !== 'check' && key !== '' ){

        error = 'El campo no puede estar vacío';

    } else {
        
        switch(key){

            case 'name':
                    nameregex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
                    if (!nameregex.test(value)){
                        error = 'No debe contener caracteres especiales';
                    }
                break;

            case 'email':
                emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if(!emailRegex.test(value)){
                    error = 'Conflicto en el formato de Email';
                }
                break;

            case 'phone':
                if(value.length != 8 || value.length !=9){
                    phoneRegex = /^[0-9]{8,9}$/;
                    if (!phoneRegex.test(value)){
                        error = 'El teléfono debe de tener 8 o 9 digitos';
                    }
                }
                break;

            case 'password':
                tempPassword = value;
                if(value.length<8){
                    error = 'La contraseña debe tener 8 o 9 digitos';
                }
                break;

            case 'password_confirmation':
                if(value.length<8 || value != tempPassword){
                    error = 'Las contraseñas son distintas';
                }
                break;

            case 'nearby_areas_id':
                if(value == ''){
                    error = 'Seleccione una área de actuación';
                }
                break;

            case 'state':
                if(value == ''){
                    error = 'Seleccione una provincia';
                }
                break;

            case 'city':
                if(value == ''){
                    error = 'Seleccione una ciudad';
                }
                break;

            case 'address':
                if(value.length<5){
                    error = 'Dirección incompleta';
                }
                break;

            case 'zip_code':
                if(value.length<5){
                    error = 'El código postal debe de tener 5 digitos';
                }
                break;

            case 'cif':
                if(value.length != 8 || value.length != 9){
                    error = 'CIF Incompleto';
                }
                break;

            case 'corporate_name':
                if(value.length<3){
                    error = 'Conflicto en nombre de la asociación';
                }
                break;

            case 'activity_areas_id':
                if(value == ''){
                    error = 'Seleccione una área de actividad';
                }
                break;
        }
    }

    if (error!= '') printError(key,error)
       
    return error;
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

/** Error Server */
function errorServer(data){
    
    $.each(data, function(i, field) {

        printError(i,field)
        
        return false;
    });
}

/** Print Errors */
function printError(key,error){
    $(".error").remove();
    $("#"+ key).after(
        "<div class='col-lg-12 alert alert-danger error' role='alert'>" +
            "<b>" + error + "</b>"+
        "</div>");
}
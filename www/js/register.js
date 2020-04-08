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

    $( "input" ).blur(function() {
        error = checkValues(this.name, this.value);
        
        $(".error").remove();
         if (error != ''){
 
            // Add new error
            $("#"+this.name).after("<small class='error'><p style='text-align:center; color:red'><strong>Conflicto en el campo " + this.name + "</strong></p></small>");

            //Exit each
            return false
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
        
        // Delete old error
        $(".error").remove();

        if (error != ''){
            // Add new error
            $("#"+field.name).after("<small class='error'><p style='text-align:center; color:red'><strong>" + error + "</strong></p></small>");

            //Exit each
            return false
        }

        //Load Data
        data[field.name] = field.value;
    });

    // Warning CheckBox Legal
    let legal = $('#checkLegal').is(":checked");
    $('.user-form-check').css("color",legal ? "#212529" : "red");
    $('.user-form-check').css("font-weight",legal ? "normal" : "bold");

    // Error First
    if (error != '' || !legal ) return null;
    
    // Validating All Data
    return data;
    
}

/** Check Values */
function checkValues(key, value){
    var estado = '';
            
    if (value.length === 0 && key !== 'check' && key !== '' ){

        estado = 'El campo no puede estar vacío';

    } else {
        
        switch(key){

            case 'name':
                    nameregex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
                    if (!nameregex.test(value)){
                        estado = 'No debe contener caracteres especiales';
                    }
                break;

            case 'email':
                emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if(!emailRegex.test(value)){
                    estado = 'Conflicto en el formato de Email';
                }
                break;

            case 'phone':
                if(value.length != 8 || value.length !=9){
                    phoneRegex = /^[0-9]{8,9}$/;
                    if (!phoneRegex.test(value)){
                        estado = 'El teléfono debe de tener 8 o 9 digitos';
                    }
                }
                break;

            case 'password':
                tempPassword = value;
                if(value.length<8){
                    estado = 'La contraseña debe tener 8 o 9 digitos';
                }
                break;

            case 'password_confirmation':
                if(value.length<8 || value != tempPassword){
                    estado = 'Las contraseñas son distintas';
                }
                break;

            case 'nearby_areas_id':
                if(value == ''){
                    estado = 'Seleccione una área de actuación';
                }
                break;

            case 'state':
                if(value == ''){
                    estado = 'Seleccione una provincia';
                }
                break;

            case 'city':
                if(value == ''){
                    estado = 'Seleccione una ciudad';
                }
                break;

            case 'address':
                if(value.length<5){
                    estado = 'Dirección incompleta';
                }
                break;

            case 'zip_code':
                if(value.length<5){
                    estado = 'El código postal debe de tener 5 digitos';
                }
                break;

            case 'cif':
                if(value.length != 8 || value.length != 9){
                    estado = 'CIF Incompleto';
                }
                break;

            case 'corporate_name':
                if(value.length<3){
                    estado = 'Conflicto en nombre de la asociación';
                }
                break;

            case 'activity_areas_id':
                if(value == ''){
                    estado = 'Seleccione una área de actividad';
                }
                break;
        }
    }

    //if (estado!= '') $('input[name='+ key +']').focus();
       
    return estado;
}

/** Error Server */
function errorServer(data){
    $.each(data, function(i, field) {
        $(".error").remove();
        $("#"+ i).after("<small class='error'><p style='text-align:center; color:red'><strong>" + field + "</strong></p></small>");
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
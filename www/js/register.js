var tempPassword = '';
$( document ).ready(function() {
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

    $('#form-help, #form-vol, #form-ent').submit(function( event ) {
        // grecaptcha.execute();
        event.preventDefault(); 
        var data = {};
        var errors = '';
        $.each(event.originalEvent.srcElement.elements, function(i, field) {
            errors = errors + checkValues(field.name, field.value);
            data[field.name] = field.value;
        });
        if(errors == ''){
            postData($(this).attr('id'), data, event);
        }else{
            event.target.firstElementChild.innerHTML = errors;
        }
    });
});

/** Services */
function postData(formId, data, event){
    event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/register',
        data : data,
        dataType: "json"
    }).then(function(data) {
        window.location.href="./registro-confirmado";
    }).fail(function(data) {
        $(formId + ' .errors').html('Error en la inscripción, <a href="./">intentelo de nuevo</a>.<br>');

        if (data.responseJSON && data.responseJSON.errors) {
            $.each(data.responseJSON.errors, function(i, field) {
                $(formId + ' .errors').append('<b>' + i + '</b>: ' + field + '<br>');
            });
        }
    });
};

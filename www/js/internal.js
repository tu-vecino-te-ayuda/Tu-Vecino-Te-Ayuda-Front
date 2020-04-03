$( document ).ready(function() {
    loadUserData();
    getOwnHelp();
    getUnassignedHelp();
    getAsocList();
    $("#create-help").click(function( event ) {  
        var data = {
            'help_request_type_id': $("#help_request_type_id option:selected").val(),
            'message': $("#message").val()
        };
        createHelp(data, event);
    });  

    $('#helpNow').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('whatever');
        actual_help_id = id;
    });

    $("#helpNowButton").click(function( event ) {  
        aceptHelp(actual_help_id);
    });     
    
    $("#save-enroll").click(function( event ) {  
        enrollAsoc($("#asoc_id").val());
    });      
    
    $("#save-data").click(function( event ) {  
        var data = {};
        
        $.each(document.forms['form-edit'].elements, function(i, field) {
            data[field.name] = field.value;
        });
        saveData(data);
        event.preventDefault();  
    });  

    $("#verify-data").click(function( event ) {  
        var data = {};
        
        $.each(document.forms['form-verify'].elements, function(i, field) {
            if(field.name!='file-image'){
                data[field.name] = field.value;
            }
        });
        verifyData(data);
        event.preventDefault();  
    });   


    var randomSlide = Math.floor(Math.random() * $('#carouselThanks .carousel-indicators li').length);
    $('#carouselThanks').carousel(randomSlide);
    $('#carouselThanks').carousel('next');

    $('#file-image').change(function(e){
        var file = e.target.files[0],
          reader = new FileReader();
      
        reader.onloadend = function () {
          // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
          var b64 = reader.result.replace(/^data:.+;base64,/, '');
          $('#image').val(b64);
        };
        reader.readAsDataURL(file);
      });
});


/** Services */

var actual_help_id = null;
var token = null;
var user_type_id = null;
var associations = [];
var loader = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";


function createHelp(data, event){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/help-requests',
        data : data,
        dataType: "json",
        headers: {'Authorization': 'Bearer '+token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        $('#createHelp').modal('hide');
        setTimeout(location.reload(), 1500);
        //event.target.innerHTML = "Inscripción realizada con éxito, revise su correo electrónico.";
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
        //event.target.innerHTML = "Error en la inscripción, intentelo de nuevo.";
    });
};

function getAsocUsers(){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "GET",
        url : server+'api/user/associates',
        headers: {'Authorization': 'Bearer ' + token},
    }).then(function(data) {
        console.log("Ok lista usuarios: ");
        console.log(data);
        if (data.data.length > 0){
            generateTableMyUsers(data.data);
        }else{
            $("#tablecontent-users").append('<tr><td colspan="7" class="text-center">Por ahora no tienes voluntarios enlazados, gracias por tu colaboración y ¡nos vemos mañana!</td></tr>');
        }
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};

function getUnassignedHelp(){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "GET",
        url : server+'api/help-requests/pending',
        headers: {'Authorization': 'Bearer ' + token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        if (data.data.length > 0){
            generateTableUnassigned(data.data);
        }else{
            $("#tablecontent-unassigned").append('<tr><td colspan="7" class="text-center">Por ahora no tenemos solicitudes de ayuda en tu zona, gracias por tu colaboración y ¡nos vemos mañana!</td></tr>');
        }
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};

function getOwnHelp(){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "GET",
        url : server+'api/help-requests',
        headers: {'Authorization': 'Bearer ' + token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        if (data.data.length > 0){
            generateTableOwn(data.data);
        }else{
            if(user_type_id==1){
                $('#firstTime').modal('show');
            }
            $("#tablecontent-own").append('<tr><td colspan="7" class="text-center">Por ahora no tienes solicitudes de ayuda en tu lista ¿Empezamos?</td></tr>');
        }
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};

function saveData(data, event){   
    $.ajax({
        type: "PUT",
        url : server+'api/user/update',
        data : data,
        dataType: "json",
        headers: {'Authorization': 'Bearer '+token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        $('#editData').modal('hide');
        updateUserSession(data.user);
        setTimeout(location.reload(), 1500);
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};

function verifyData(data, event){   
    $.ajax({
        type: "POST",
        url : server+'api/user/verify',
        data : data,
        dataType: "json",
        headers: {'Authorization': 'Bearer '+token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        // $('#editData').modal('hide');
        // updateUserSession(data.user);
        // setTimeout(location.reload(), 1500);
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};


function enrollAsoc(id){   
    $.ajax({
        type: "POST",
        url : server+'api/user/association/join/'+id,
        headers: {'Authorization': 'Bearer '+token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        $('#enrollAsoc').modal('hide');
        addAsocSession(id);
        setTimeout(location.reload(), 1500);
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
        //event.target.innerHTML = "Error en la inscripción, intentelo de nuevo.";
    });
};

function detachAsoc(id){   
    $.ajax({
        type: "DELETE",
        url : server+'api/user/association/detach/'+id,
        headers: {'Authorization': 'Bearer '+token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        $('#enrollAsoc').modal('hide');
        deleteAsocSession(id);
        setTimeout(location.reload(), 1500);
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};

function aceptHelp(id){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/help-requests/accept/'+id,
        headers: {'Authorization': 'Bearer ' + token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        $('#helpNow').modal('hide');
        setTimeout(location.reload(), 1500);
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};

function getAsocList(){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "GET",
        url : server+'api/public/associations',
        headers: {'Authorization': 'Bearer ' + token},
    }).then(function(data) {
        console.log("Ok asoc: ");
        console.log(data);
        associations = data.data;
        if (data.data.length > 0){
            $.each(data.data, function(i, field) {
                $('#asoc_id').append($('<option>', {
                    value: field.id,
                    text: field.corporate_name
                }));
            });
        }else{
            $("#tablecontent").append('');
        }
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};


function deleteAcceptedHelps(id){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "DELETE",
        url : server+'api/help-requests/revert/'+id,
        headers: {'Authorization': 'Bearer ' + token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        setTimeout(location.reload(), 1500);
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};


function deleteCreatedHelps(id){
    // event.target.innerHTML = loader;
    $.ajax({
        type: "DELETE",
        url : server+'api/help-requests/'+id,
        headers: {'Authorization': 'Bearer ' + token},
    }).then(function(data) {
        console.log("Ok: ");
        console.log(data);
        setTimeout(location.reload(), 1500);
    }).fail(function(data) {
        console.log("Error: ");
        console.log(data);
    });
};


/** Functions */

function generateTableUnassigned(data){
    var table_temp = '';

    $.each(data, function (key, entry) {
        var icon = '';
        if(entry.assigned_user_count > 0){
            icon = '<i class="fa fa-check-circle" title="Voluntario Asignado"></i>';
        }else{
            icon = '<i class="fa fa-minus-square" title="Pendiente de Asignar"></i>';
        }
        table_temp = table_temp + '<tr>'+
            '<td class="text-center text-warning">'+
            '<h6>'+icon+'<span class="badge badge-light" title="Voluntarios Asignados">'+entry.assigned_user_count+'</span></h6>'+
            '</td>'+
            '<th scope="row">'+entry.created_at+'</th>'+
            '<td style="width: 300px;">'+help_request_types[entry.help_request_type.id]+'<br>'+
            '<div><textarea disabled>Comentario: '+entry.message+'</textarea></td>'+
            '<td>'+obtainState(entry.user.state)+'</td>'+
            '<td>'+obtainCity(entry.user.city)+'</td>'+
            '<td>'+entry.user.zip_code+'</td>'+
            '<td>'+
            '<button type="button" class="btn btn-outline-success btn-sm"  data-toggle="modal" data-target="#helpNow" data-whatever="'+entry.id+'">¡Yo te Ayudo!</button>'+
            '</td>'+
        '</tr>';
    });

    $("#tablecontent-unassigned").append(table_temp);
}

function generateTableOwn(data){
    var table_temp = '';
    var buttons = '';

    $.each(data, function (key, entry) {
        var accepted_at = (entry.accepted_at) ? entry.accepted_at : "Pendiente de Asignar";
        var name = "";
        var phone = "";
        var email = "";

        if(user_type_id == 1){
            if(entry.assigned_user_id.length == 0){
                name = "---";
                phone = "---";
                email = "---";
            }else{
                $.each(entry.assigned_user_id, function (key, entry) {
                    name = entry.name+'<br>';
                    phone = entry.phone;
                    email = entry.email+'<br>';
                });
            }
        }

        
        if(user_type_id == 1){
            buttons = '<span class="delete-help" onclick="deleteCreatedHelps('+entry.id+')"><i class="fa fa-trash" title="Eliminar solicitud de ayuda" ></i></span>';
        }

        if(user_type_id == 2){
            name = "¡Tu estas ayudando!";
            phone = "---";
            email = "---";
            buttons = '<span class="detach-help" onclick="deleteAcceptedHelps('+entry.id+')"><i class="fa fa-trash" title="Declinar solicitud de ayuda"></i></span>';
        }

        table_temp = table_temp + '<tr>'+
            '<th scope="row"><small>'+entry.created_at+'<br>'+accepted_at+'</small></th>'+
            '<td  style="width: 300px;">'+help_request_types[entry.help_request_type.id]+'<br>'+
            '<div><textarea disabled>Comentario: '+entry.message+'</textarea></td>'+
            '<td>'+entry.user.address+' <br>'+
            obtainCity(entry.user.city)+', '+obtainState(entry.user.state)+' ('+entry.user.zip_code+')</td>'+
            '<td>'+entry.user.name+' <br> '+ name +'</td>'+
            '<td>'+entry.user.phone+' / '+entry.user.email+' <br> '+ phone+' / '+email+'</td>'+
            '<td class="text-center text-secondary">'+
            '<h6>'+buttons+'</h6>' +
            '</td>'+
        '</tr>';
    });

    $("#tablecontent-own").append(table_temp);
}


function generateTableMyAsoc(data){
    var table_temp = '';

    $.each(data, function (key, entry) {
        table_temp = table_temp + '<tr>'+
            '<th scope="row">'+entry.corporate_name+'</th>'+
            '<td>'+entry.email+'</td>'+
            '<td>'+entry.phone+'</td>'+
            '<td>'+entry.activity_areas_id.name+'</td>'+
            '<td>'+obtainState(entry.state)+'</td>'+
            '<td>'+obtainCity(entry.city)+'</td>'+
        '</tr>';
    });

    $("#tablecontent-asoc-own").append(table_temp);
}


function generateTableMyUsers(data){
    var table_temp = '';

    $.each(data, function (key, entry) {
        table_temp = table_temp + '<tr>'+
            '<th scope="row">'+entry.name+'</th>'+
            '<td>'+entry.email+'</td>'+
            '<td>'+entry.phone+'</td>'+
            '<td>'+entry.nearby_areas_id.name+'</td>'+
            '<td>'+obtainState(entry.state)+'</td>'+
            '<td>'+obtainCity(entry.city)+'</td>'+
            '<td>'+entry.zip_code+'</td>'+
        '</tr>';
    });

    $("#tablecontent-users").append(table_temp);
}

function loadUserData(){
    var data = $.parseJSON(sessionStorage.getItem('userData'));
    if (data === null) {
        window.location.href="./";
      }
    token = data.token;
    user_type_id = data.user.user_type_id.id;
    console.log(data);
    $("#user-name").append(data.user.name);
    $("#user-city").append(obtainCity(data.user.city));
    $("#user-state").append(obtainState(data.user.state));

    $("#address").val(data.user.address);
    $("#zip_code").val(data.user.zip_code);

    if(data.user.corporate_name){
        $("#asoc-name").append('(<b>'+data.user.corporate_name+'</b>)');
    }

    if(data.user.email=='javioreto@gmail.com'){
        $('#verify').modal('show');
    }

    switch(user_type_id){
        case 1:
            $("#btn-showPhone").removeClass("d-none");
            $("#nearby_areas_id").hide();
            $("#btn-createHelp").removeClass("d-none");
            $("#sect-own-results").removeClass("d-none");
            break;
        case 2:
            $("#btn-enrollAsoc").removeClass("d-none");
            if(data.user.associations.length > 0){
                $("#sect-asoc").removeClass("d-none");
                generateTableMyAsoc(data.user.associations);
                $.each(data.user.associations, function (key, entry) {
                    $("#associations-delete").append('<span class="ml-2">'+entry.corporate_name+' <a href="javascript:detachAsoc('+entry.id+')" title="Eliminar relación"><i class="fa fa-trash"></i></a></span>');
                });
            }
            
            $("#downloadPdf").removeClass("d-none");
            $("#sect-results").removeClass("d-none");
            $("#sect-own-results").removeClass("d-none");
            $(".detach-help").css("display", "block");
            $('#nearby_areas_id option[value="'+data.user.nearby_areas_id.id+'"]').attr("selected", "selected");
            break;
        case 3:
            getAsocUsers();
            $("#nearby_areas_id").hide();
            $("#btn-editData").removeClass("d-none");
            $("#sect-users").removeClass("d-none");
            $("#sect-results").removeClass("d-none");
            $(".delete-help").css("display", "block");
            $("#helpNow .modal-body").html('<p>Como Asociación no puede hacerse cargo directamente de una solicitud, pero puede <b>gestionar a sus voluntarios</b> para que atiendan estas peticiones.</p>');
            $("#helpNow .btn-success").hide();
            $('#nearby_areas_id option[value="'+data.user.nearby_areas_id.id+'"]').attr("selected", "selected");
            break;
    }
    
    $("#sect-loader").addClass("d-none");

    let ayudaprov = $('.ayuda-provincia');
    let ayudaciudad = $('.ayuda-ciudad');


    $.each(provincias, function (key, entry) {
        if(data.user.state == entry.id){
            ayudaprov.append($('<option></option>').attr('value', entry.id).attr("selected","selected").text(entry.nm));
        }else{
            ayudaprov.append($('<option></option>').attr('value', entry.id).text(entry.nm));
        }
    });

    $.each(ciudades, function (key, entry) {
        if(entry.id.substring(0,2) == data.user.state){
            if(data.user.city == entry.id){
                ayudaciudad.append($('<option></option>').attr('value', entry.id).attr("selected","selected").text(entry.nm));
            }else{
                ayudaciudad.append($('<option></option>').attr('value', entry.id).text(entry.nm));
            }
        }
    });   


}


/** Update session */

function deleteAsocSession(id){
    var data = $.parseJSON(sessionStorage.getItem('userData'));
    var tempAsoc = [];
    $.each(data.user.associations, function (key, entry) {
        if(entry.id != id){
            tempAsoc.push(entry);
        }
    });
    data.user.associations = tempAsoc;
    sessionStorage.setItem('userData', JSON.stringify(data));
};

function addAsocSession(id){
    var data = $.parseJSON(sessionStorage.getItem('userData'));
    var tempAsoc = [];
    $.each(data.user.associations, function (key, entry) {
            tempAsoc.push(entry);
    });
    console.log(tempAsoc);
    $.each(associations, function (key, entry) {
        if(entry.id==id){
            tempAsoc.push(entry);
            return;
        }
    });
    data.user.associations = tempAsoc;
    sessionStorage.setItem('userData', JSON.stringify(data));
};

function updateUserSession(userdata){
    var data = $.parseJSON(sessionStorage.getItem('userData'));
    data.user = userdata;
    sessionStorage.setItem('userData', JSON.stringify(data));
};


var email = '';
var token = '';

$( document ).ready(function() {

    if (!paramsOk()) window.location.href="./";

    $('#form-change-password').submit(function( event ) {
        var data = getDataForm(event);

        if (data.password === data.password_confirmation){
            changePassword(data);
        }else{
            // Print Error
            $(".error").remove();
            $("#password_confirmation").after(
                "<div class='col-lg-12 alert alert-danger error' role='alert' " +
                    "<b>Las contraseñas no coinciden</b>"+
                "</div>");
        }
    });

    // OnChange input text
    $('#form-change-password').on("input", function(){
        $(".error").remove();
    });
});

function paramsOk(){
    
    let params = new URLSearchParams(window.location.search);
    if(!params.has('email') || !params.has('token')) return false;
    token = params.get('token');
    email = params.get('email');
    
    return true;
}

function getDataForm(event){

    var data = {};
    data['email'] = email;
    data['token'] = token;
    event.preventDefault(); 

    $.each(event.originalEvent.srcElement.elements, function(i, field) {
        data[field.name] = field.value;
    });
   
    return data;
    
}

function changePassword(data){
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/password/reset',
        data : data,
        dataType: "json"
    }).then(function(data) {
        $(".form-change-password").addClass("d-none");
        $("#sendEmailOk").removeClass("d-none");
    }).fail(function(data) {
        $("#sendEmailErr").removeClass("d-none");
    });
};
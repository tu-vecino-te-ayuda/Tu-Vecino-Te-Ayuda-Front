$( document ).ready(function() {
    
    /** User Auth */
    if (isUserAuth()) window.location.href="./dashboard";

    $('#form-login').submit(function( event ) {
        login(getDataForm(event));
    });
});


/** Is User Auth */
function isUserAuth(){

    if ($.parseJSON(sessionStorage.getItem('userData')) !== null) {
        return true
    }

    return false
}

/** Data Form */
function getDataForm(event){
    event.preventDefault(); 
    var data = {};
    $.each(event.originalEvent.srcElement.elements, function(i, field) {
        data[field.name] = field.value;
    });
   
    return data;
    
}

/** Login */
function login(data){
    $.ajax({
        type: "POST",
        url : server +'api/public/auth/login',
        data : data,
        dataType: "json"
    }).then(function(data) {
        sessionStorage.setItem('userData', JSON.stringify(data));
        window.location.href="./dashboard";
    }).fail(function(data) {
        $(".error").remove();
        $("#password").after(
            "<div class='col-lg-12 alert alert-danger error' role='alert' " +
            "<b>Autentificación fallida</b>"+
        "</div>");
    });
};
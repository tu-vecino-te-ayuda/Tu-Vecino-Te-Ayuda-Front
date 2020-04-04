$( document ).ready(function() {
    let urlParams = new URLSearchParams(window.location.search);
    
    if(urlParams.has('verified')){
        if(urlParams.get('verified')=='true'){
            $("#emailOk").removeClass("d-none");
        }else{
            $("#emailErr").removeClass("d-none");
        }
    } else if(urlParams.has('email') && urlParams.has('token')){
        $("#email").val(urlParams.get('email'));
        $("#token").val(urlParams.get('token'));
    }

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
        console.error(errors);
        if(errors == ''){
            switch(event.target.id){
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
});

function login(data, event){
    event.target.innerHTML = loader;
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/login',
        data : data,
        dataType: "json"
    }).then(function(data) {
        sessionStorage.setItem('userData', JSON.stringify(data));
        window.location.href="./dashboard";
    }).fail(function(data) {
        $("#form-login .errors").html("Error en la autenticación, inténtelo de nuevo.");
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
        url : server+'api/public/auth/password/reset',
        data : data,
        dataType: "json"
    }).then(function(data) {
        $("#recoverOk").removeClass("d-none");
    }).fail(function(data) {
        $("#recoverErr").removeClass("d-none");
    });
};
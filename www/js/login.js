$( document ).ready(function() {
    let urlParams = new URLSearchParams(window.location.search)

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
        url : server+'api/public/auth/password/reset',
        data : data,
        dataType: "json"
    }).then(function(data) {
        $("#recoverOk").removeClass("d-none");
    }).fail(function(data) {
        $("#recoverErr").removeClass("d-none");
    });
};
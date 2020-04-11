$( document ).ready(function() {
    $('#form-send-email').submit(function( event ) {
        var data = getDataForm(event);
        sendMail(data);
    });
});

function getDataForm(event){
    event.preventDefault(); 
    var data = {};
    $.each(event.originalEvent.srcElement.elements, function(i, field) {
        data[field.name] = field.value;
    });
   
    return data;
    
}

function sendMail(data){
    $.ajax({
        type: "POST",
        url : server+'api/public/auth/password/email',
        data : data,
        dataType: "json"
    }).then(function(data) {
        $(".form-send-email").addClass("d-none");
        $("#sendEmailOk").removeClass("d-none");
    }).fail(function(data) {
        $("#sendEmailErr").removeClass("d-none");
    });
};
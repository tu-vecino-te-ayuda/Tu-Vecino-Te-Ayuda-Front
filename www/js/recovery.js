$( document ).ready(function() {
    let urlParams = new URLSearchParams(window.location.search);
    if(!urlParams.has('email') || !urlParams.has('token')){
        window.location.href="./";
    }
});
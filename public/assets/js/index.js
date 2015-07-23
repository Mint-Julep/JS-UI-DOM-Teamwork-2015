$('#index-form h2').on('click', function () {
    if($(this).hasClass('current')){
        return;
    }
    $('#index-form .index-form').animate({
        height: 'toggle'
    }, {
        duration: 200,
        queue: false
    });

    $('#index-form h2').toggleClass('current');
});

var socket = io.connect('localhost:3000/');
$('#log-in').on('click', function () {
    socket.emit('log-in', {
        name: $('.log-in input[name="user"]').val(),
        pass: $('.log-in input[name="pass"]').val()
    });
});

$('#register').on('click', function () {
    socket.emit('register', {
        name: $('.register input[name="user"]').val(),
        pass: $('.register input[name="pass"]').val()
    });
});

socket.on('log-in', function (data) {
    document.cookie = "user=" + data.username + "; expires=Thu, 30 Aug 2015 12:00:00 UTC path=/";
    window.location.href = window.location.href + 'game/multiplayer/';
});

socket.on('register', function (data) {
    $('.index-form .success').html(data.text);
    $('.index-form .success').slideDown();

    $(document).bind('click', function() {
        $(this).unbind('click');
        $('.success').slideUp();
        $('.success').html('');
    });
});

socket.on('form-error', function (data) {
    $('.index-form.'+data.form+' .error').html(data.text);
    $('.index-form.'+data.form+' .error').slideDown();

    $(document).bind('click', function() {
        $(this).unbind('click');
        $('.error').slideUp();
        $('.error').html('');
    });
});

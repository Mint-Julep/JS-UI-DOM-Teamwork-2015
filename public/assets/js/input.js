(function () {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key, unknown=true;

        switch (code) {
            case 32:
                key = 'SPACE';
                unknown=false;
                break;
            case 37:
                key = 'LEFT';
                unknown=false;
                break;
            case 38:
                key = 'UP';
                unknown=false;
                break;
            case 39:
                key = 'RIGHT';
                unknown=false;
                break;
            case 40:
                key = 'DOWN';
                unknown=false;
                break;
            default:
                // Convert ASCII codes to letters
                key = String.fromCharCode(code);
        }

        if(!unknown){
            event.preventDefault();
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function (e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function (e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function () {
        pressedKeys = {};
    });

    window.input = {
        isDown: function (key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();

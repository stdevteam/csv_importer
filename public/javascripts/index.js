;(function(window, document,$){
    var socket = io.connect('localhost:8080');

    socket.on('connect', function(){
        console.log('connect');
    });
    socket.on('progress', function(data){
        $('#progress').text(data + "%");
        console.log(data);
    });
    socket.on('disconnect', function(){
        console.log('disconnect');
    });

    $('#send').on('click', function(){
        var data = $('#csv')[0].files[0];
        var formData = new FormData();
        formData.append('csv', data);
        $.ajax({
            url: '/save-csv',
            data: formData,
            type: 'POST',
            contentType:false,
            processData: false,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            console.log('loaded')
                        }
                    } , false);
                }
                return myXhr;
            }
        })
    });
})(window, document, $);

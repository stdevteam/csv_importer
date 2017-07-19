;(function(){
    var express = require('express');
    var app = express();
    var router = express.Router();
    var multer = require('multer');
    var upload = multer();
    var User = require("../crud/user.js");
    var io;
    // We can set chunkSize param depend our RAM restrictions
    var chunkSize = 100;

    var expressSocketIo  = require('express-socket.io');
    var server  = expressSocketIo.init(app);
    var port = process.env.port || 8080;

    server.listen(port, function() {
        console.log('Server saa on port: ', port);
    });

    expressSocketIo.then(function(socketIo) {
        io = socketIo;
    });

    router.post('/', upload.single('csv'),function(req, res, next) {
        var bufferString = req.file.buffer.toString();
        bufferToJson(bufferString);
        res.send('POST request to the homepage')
    });

    function bufferToJson(bufferString) {
        var users = bufferString.split('\n');
        var headers = users[0].split(',');
        var csvInfo = {
            usersCount: users.length,
            chunkObject: []
        };
        saveUsers.apply(csvInfo, [users, 1, headers]);
    }

    // TODO: use DB transactions
    function saveUsers(users, i, headers){
        if(i >= this.usersCount){
            User.bulkCreate(this.chunkObject);
            // TODO: send message to a specific user who uploaded the file
            //we have finished csv saving process
            io.sockets.emit('progress', 100);
            return;
        }
        if(i % chunkSize === 0){
            User.bulkCreate(this.chunkObject);
            // TODO: send message to a specific user who uploaded the file
            io.sockets.emit('progress', ~~(i * 100 / this.usersCount));
            this.chunkObject = [];
        }
        var data = users[i].split(',');
        var obj = {};
        for(var j = 0; j < data.length; j++) {
            obj[headers[j].trim()] = data[j].trim();
        }
        this.chunkObject.push(obj);
        i++;
        setTimeout(saveUsers.bind(this, users, i, headers));
    }

    return module.exports = router;
})();


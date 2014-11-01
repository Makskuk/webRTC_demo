var express = require('express'),
	path	= require('path'),
	server	= require('http').createServer(app),
	io      = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {    // При подключении
    socket.emit('server event', { hello: 'world' }); // отправим сообщение
    
    socket.on('client event', function (data) {      // и объявим обработчик события при поступлении сообщения от клиента
        console.log(data);
    });
    
    socket.on('offer', function (data) { // При получении сообщения 'offer',
        // так как клиентское соединение в данном примере всего одно,
        // отправим сообщение обратно через тот же сокет
        socket.emit('offer', data); 
        // Если бы было необходимо переслать сообщение по всем соединениям, 
        // кроме отправителя:
        // soket.broadcast.emit('offer', data);
    });
    
    socket.on('answer', function (data) {
        socket.emit('answer', data);
    });
    
    socket.on('ice1', function (data) {
        socket.emit('ice1', data);
    });
    
    socket.on('ice2', function (data) {
        socket.emit('ice2', data);
    });
    
    socket.on('hangup', function (data) {
        socket.emit('hangup', data);
    });
});

var app		= express();

app.set('port', 4000);
app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), function(){
	console.log('Server running at http://localhost:'+ app.get('port'));
});
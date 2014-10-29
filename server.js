var express = require('express'),
	path	= require('path'),
	http	= require('http');

var app		= express();
var server	= http.createServer(app);

app.set('port', 4000);
app.use(express.static(path.join(__dirname, 'public')));

var http_logger_dev_stream = {
	write: function(message, encoding){
		console.log(message);
	}
}

//app.use(express.logger({stream:http_logger_dev_stream}));

server.listen(app.get('port'), function(){
	console.log('Server running at http://localhost:'+ app.get('port'));
});
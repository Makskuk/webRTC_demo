var localStream = null;

// Запрашиваем доступ и к аудио, и к видео
var streamConstraints = { 
		"audio": true
		/*"video":{
			"mandatory": { 
				"maxWidth": "320",
				"maxHeight": "240",
				"maxFrameRate": "5" 
			},
			"optional": []
		} */
	}; 

function getUserMedia_success(stream) {
	console.log("getUserMedia_success():", stream);
	localVideo1.src = URL.createObjectURL(stream); // Подключаем медиапоток к HTML-элементу <video>
	localStream = stream; // и сохраняем в глобальной переменной для дальнейшего использования
}

function getUserMedia_error(error) {
	console.log("getUserMedia_error():", error);
}

function getUserMedia_click() {
	console.log("getUserMedia_click()");
	navigator.getUserMedia = (	navigator.getUserMedia ||
				 				navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia ||
								navigator.msGetUserMedia);

	if (navigator.getUserMedia) {
		navigator.getUserMedia (
					streamConstraints,
					getUserMedia_success,
					getUserMedia_error
	   );
	} else {
	   console.log("getUserMedia not supported");
	}
}
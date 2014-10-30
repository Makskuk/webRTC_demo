var localStream = null;
var pc1, pc2;
var servers = null;
var offerConstraints = {};

// Запрашиваем доступ и к аудио, и к видео
var streamConstraints = { 
		"audio": true,
		"video":{
			"mandatory": { "chromeMediaSource": 'screen'  },
			"optional": []
		}
	}; 

function getUserMedia_success(stream) {
	console.log("getUserMedia_success():", stream);
	localVideo1.src = URL.createObjectURL(stream); // Подключаем медиапоток к HTML-элементу <video>
	localStream = stream; // и сохраняем в глобальной переменной для дальнейшего использования
}

function getUserMedia_error(error) {
	console.log("getUserMedia_error():", error);
	alert("getUserMedia_error()");
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

function pc1_createOffer_success(desc) {
  console.log("pc1_createOffer_success(): \ndesc.sdp:\n"+desc.sdp+"desc:", desc);
  pc1.setLocalDescription(desc);  // Зададим RTCPeerConnection, сформированный Offer SDP методом setLocalDescription. 
  // Когда дальняя сторона пришлет свой Answer SDP, его нужно будет задать методом setRemoteDescription 
  // Пока вторая сторона не реализована, ничего не делаем
  pc2_receivedOffer(desc);
}

function pc1_createOffer_error(error){
  console.log("pc1_createOffer_success_error(): error:", error);
  alert("pc1_createOffer_success_error()");
}

function pc1_onicecandidate(event){
  if (event.candidate) {
    console.log("pc1_onicecandidate():\n"+ event.candidate.candidate.replace("\r\n", ""), event.candidate);
    // Пока вторая сторона не реализована, ничего не делаем
    pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function pc1_onaddstream(event) {
	console.log("pc_onaddstream()");
	remoteVideo1.src = URL.createObjectURL(event.stream);
}

function createOffer_click() {
  console.log("createOffer_click()");
  pc1 = new webkitRTCPeerConnection(servers); // Создаем RTCPeerConnection
  pc1.onicecandidate = pc1_onicecandidate;    // Callback-функция для обработки ICE-кандидатов
  pc1.onaddstream = pc1_onaddstream;          // Callback-функция, вызываемая при появлении медиапотока от дальней стороны. Пока что его нет
  pc1.addStream(localStream); // Передадим локальный медиапоток (предполагаем, что он уже получен)
  pc1.createOffer(            // И собственно запрашиваем формирование Offer
    pc1_createOffer_success,
    pc1_createOffer_error,
    offerConstraints
  );
}  

function pc2_createAnswer_success(desc) {  
  pc2.setLocalDescription(desc);
  console.log("pc2_createAnswer_success()", desc.sdp);
  pc1.setRemoteDescription(desc);
}

function pc2_createAnswer_error(error) {
  console.log('pc2_createAnswer_error():', error);
  alert('pc2_createAnswer_error()');
}

var answerConstraints = { 
  'mandatory': { 'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true } 
};

function pc2_receivedOffer(desc) {
  console.log("pc2_receiveOffer()", desc);
  // Создаем объект RTCPeerConnection для второго участника аналогично первому
  pc2 = new webkitRTCPeerConnection(servers);
  pc2.onicecandidate = pc2_onicecandidate; // Задаем обработчик события при появлении ICE-кандидата
  pc2.onaddstream = pc2_onaddstream; // При появлении потока подключим его к HTML <video>
  pc2.addStream(localStream); // Передадим локальный медиапоток (в нашем примере у второго участника он тот же, что и у первого)
  // Теперь, когда второй RTCPeerConnection готов, передадим ему полученный Offer SDP (первому мы передавали локальный поток)
   pc2.setRemoteDescription( new RTCSessionDescription(desc) );
  // Запросим у второго соединения формирование данных для сообщения Answer
  pc2.createAnswer( 
    pc2_createAnswer_success,
    pc2_createAnswer_error,
    answerConstraints
  );
}

function pc2_onicecandidate(event) {
  if (event.candidate) {
    console.log("pc2_onicecandidate():", event.candidate.candidate);
    pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function pc2_onaddstream(event) {
  console.log("pc_onaddstream()");
  remoteVideo2.src = URL.createObjectURL(event.stream);
}

function btnHangupClick() {
  // Отключаем локальное видео от HTML-элементов <video>, останавливаем локальный медиапоток, устанавливаем = null
  localVideo1.src = ""; localStream.stop(); localStream = null;
  // Для каждого из участников отключаем видео от HTML-элементов <video>, закрываем соединение, устанавливаем указатель = null
  remoteVideo1.src = ""; pc1.close(); pc1 = null;
  remoteVideo2.src = ""; pc2.close(); pc2 = null; 
}
$(document).ready(function(){
  // *****************************************************************************************************
// ****************************************CAMERA APP*****************************************************
// *******************************************************************************************************

var imageCapture;

var img = document.querySelector('img');
var video = document.querySelector('video');
var takePhotoButton = document.querySelector('button#takePhoto');
var fullscreenButton = document.querySelector('#fullscreen');
var switchCameraButton = document.querySelector('#switchCamera');
var retakeButton = document.querySelector('#retake');
var savePictureButton = document.querySelector('#savePicture');
var modal = document.querySelector('#cameraModal');
var acceptButton = document.querySelector('#cameraAccept');
var line = document.getElementById('#cameraLine');
var picture = document.getElementById('#Picture');

// img.style.visibility = 'hidden';


//************************************* LAYOUT *****************************************

//Hide the retake,save picture button. Hide Picture element.

$('#retake').hide();
$('#savePicture').hide();
$('#Picture').hide();

// Ask user to enable device motion to allow spirit line
$('cameraLine').show();


//************************************* OPERATING SYSTEM DETECTION *****************************************
var OperatingSystem = {
 Android: function() {
     return navigator.userAgent.match(/Android/i);
  },

  iOS: function() {
     return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }
};

//***************************** OPEN THE CAMERA BY ASKING USER PERMISSION(APPLE DEVICE) AND APPLY VIDEO STREAM SETTINGS ***********************************

const constraints = {
  width: { min: 1440, ideal: 1280, max: 3984 },
  height: { min: 1080, ideal: 720, max: 2988 },
  aspectRatio: 4/3,
  frameRate:{max: 30}
  };

navigator.mediaDevices.getUserMedia({video: true
}).then(mediaStream => {
    document.querySelector('video').srcObject = mediaStream;

    const track = mediaStream.getVideoTracks()[0];

    track.applyConstraints(constraints);

    imageCapture = new ImageCapture(track);
    
  })
  .catch(error =>{
    if (error.toString().includes('Permission denied')){
      alert('Camera APP requires your permission to access the camera. If you have accidentally Blocked the camera access you need to unblock it in your browser settings.')
    } else {
      alert('Error starting camera. Please allow camera access'+ error)
    }
  });

//************************************* GO INTO FULLSCREEN (ONLY ANDRIOD DEVICE WORK) *****************************************

fullscreenButton.onclick = function() {

  $('#fullscreen').attr('aria-pressed', true);

 //ACTIVATE FULLSCREEN
 if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
  if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
  document.documentElement.mozRequestFullScreen(); // Firefox
  } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(); // Chrome and Safari
  } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen(); // IE
  }

//DEACTIVATE FULLSCREEN
} else {
  $('#fullscreen').attr('aria-pressed', false);
  if (document.exitFullscreen) {
      document.exitFullscreen();
  } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
  }
}

  }
//************************************* SPIRIT LEVEL *****************************************

function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;

  if(beta <=1 && beta >= -1)
    {
      line.style.backgroundColor = 'green';
    }
    else
    {
      line.style.backgroundColor = 'red';
    }

    if (permissionForOrientation==='need'){
      $('#cameraModal').show(); // show dialog asking user to enable motion sensor
    }
}

var permissionForOrientation = 'none';
// when page loads checks if the device requires user to to enable motion sensors, If they do then display the dialog
if ( window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function' ){
  permissionForOrientation = 'need';
  console.log("permision needed");
      $('#cameraModal').show(); // show dialog asking user to enable motion sensor
      
    acceptButton.onclick = function(){
    DeviceOrientationEvent.requestPermission()
  .then(response => {
    if (response == 'granted') {
      window.addEventListener("deviceorientation", handleOrientation, true);
      $('#cameraModal').hide();
    }
  })
  .catch(console.error)
    }
   
   window.addEventListener("deviceorientation", handleOrientation, true);
  } else {
    // non iOS 13+
    window.addEventListener("deviceorientation", handleOrientation, true);
  }

//************************************* FRONT/REAR CAMERA TOGGLE *****************************************

  switchCameraButton.onclick = function() {
    
    $('#switchCamera').attr('aria-pressed', true);

    }

//************************************* TAKE A PICTURE *****************************************

takePhotoButton.onclick = function () {
  
  if (OperatingSystem.iOS()) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    img.classList.remove('hidden');
    img.src = canvas.toDataURL('image/webp');
  
  }else{

    imageCapture.takePhoto().then(function(blob) {
      console.log('Photo taken:', blob);
      img.classList.remove('hidden');
      img.src = URL.createObjectURL(blob);
    }).catch(function(error) {
      console.log('takePhoto() error: ', error);
    });
  }

  //Show the picture user took
  $('#Picture').show();

  //Hide viedeo stream and the following buttons:
  $('video').hide();
  $("#takePhoto").hide();
  $("#fullscreen").hide();
  $("#switchCamera").hide();

   //Show the picture user took and the following buttons:
   $('#Picture').show();
   $("#retake").show();
   $("#savePicture").show();

}


//************************************* SAVE THE PICTURE YOU'VE JUST TAKEN WITH THE CAMERA TO KNACK*****************************************

savePictureButton.onclick = function() {
video.srcObject.getVideoTracks().forEach(track=>track.stop());
}

//*************************************RETAKE BUTTON, THIS WILL DELETE THE PHOTO TAKEN*****************************************

retakeButton.onclick = function() {

  //Clear photo and show the following buttons:
  img.src = '';

  $("#takePhoto").show();
  $("#switchCamera").show();
  $("#fullscreen").show();
  $('video').show();

  //Hide the followings;
  $('#Picture').hide();
  $("#retake").hide();
  $("#savePicture").hide();
}

});

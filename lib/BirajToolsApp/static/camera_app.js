let video = document.querySelector("#video");
let saveMessage = document.querySelector("#save-message");
let imageNumber = 1; // Variable to keep track of the image number
let equipment_sn = document.getElementById("equipment_sn").getAttribute("value");
let equipment_id = document.getElementById("equipment_id").getAttribute("value");
let equipment_name = document.getElementById("equipment_name").getAttribute("value");

function startCamera(cameraId) {
  // Stop any existing media stream
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
  }

  // Start camera with the selected cameraId
  const constraints = {
    video: {
      deviceId: { exact: cameraId },
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(error => {
      console.error('Error accessing camera: ', error);
    });
}

function getAvailableCameras() {
    navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        var cameraSelect = document.getElementById('camera-select');
        cameraSelect.innerHTML = '';
  
        var frontCameraId = null;
        var backCameraId = null;
        var usbCameraId = null;
        var otherCameraId = null;
  
        devices.forEach(function(device) {
          if (device.kind === 'videoinput') {
            var option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || 'Camera ' + (cameraSelect.options.length + 1);
            cameraSelect.appendChild(option);
  
            if (device.label.toLowerCase().includes('hd') && 
              device.label.toLowerCase().includes('usb') && 
              device.label.toLowerCase().includes('pro') || 
              device.label.toLowerCase().includes('c920')) {
              usbCameraId = device.deviceId;
            } else if (device.label.toLowerCase().includes('rear') || 
              device.label.toLowerCase().includes('back') || 
              device.label.toLowerCase().includes('Camera 2')) {
              backCameraId = device.deviceId;
            } else if (device.label.toLowerCase().includes('front')) {
              frontCameraId = device.deviceId;
            } else {
              otherCameraId = device.deviceId;
            }
          }
        });
  
        // Start camera with the back-facing camera if available, otherwise use the front-facing camera
        var selectedCameraId = usbCameraId || backCameraId || frontCameraId || otherCameraId;
        if (selectedCameraId) {
          startCamera(selectedCameraId);
          cameraSelect.value = selectedCameraId;
        }
      })
      .catch(function(err) {
        console.error('Error getting media devices: ', err);
      });
  }


  function capturePhoto() {
    // Create a new canvas element dynamically
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    
    // Set canvas dimensions to match the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame onto canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    
    // Add text overlay
    var text = equipment_sn;
    context.font = '30px Arial';
    context.fillStyle = 'yellow';
    context.fillText(text, 10, 50);
    
    // Convert canvas to Blob object with PNG format
    canvas.toBlob(function (blob) {
      // Create a new FormData object
      var formData = new FormData();
      
      // Generate the file name
      var fileName = equipment_sn + '.png';
      
      // Append the image Blob to the FormData object with the generated file name
      formData.append('photo', blob, fileName);
    
      // Send the FormData to the server using fetch API
      // Replace 'uploadURL' with the actual URL to save the image on the server
      fetch(equipment_id, {  // Add the equipment_sn as a query parameter in the URL
        method: 'POST',
        body: formData  // Send the FormData object as the request body
      })
        .then(response => {
          saveMessage.textContent = imageNumber + ' - Image/s saved successfully !';
          console.log('Image uploaded successfully');
          imageNumber++; // Increment the image number for the next capture
        })
        .catch(error => {
          saveMessage.textContent = 'Error saving image';
          console.error('Error uploading image: ', error);
        });
    }, 'image/png');
    
    // Remove the dynamically created canvas element from the DOM
    canvas.remove();
  }
  
  

// Call the function to get available cameras
getAvailableCameras();

// Event listener for camera selection
document.getElementById('camera-select').addEventListener('change', function() {
  var selectedCameraId = this.value;
  startCamera(selectedCameraId);
});

// Event listener for capturing the photo
document.getElementById('snap').addEventListener('click', capturePhoto);

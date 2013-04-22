
//************************Photo************************
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    console.log('suceess uri foto' + imageURI);
    var largeImage = document.getElementById('smallImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    // alert('get photo');
    navigator.camera.getPicture(
        onPhotoURISuccess,
        onFail,
        {
            quality: 20,
            destinationType: destinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA
        }
    );
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}

/*
 *
 * For the uploading of images to the server
 *
 */
if (document.getElementById("imgUpload") != undefined) {
    var files = document.getElementById("imgUpload");

    //process files
    files.addEventListener("change", function(e) {
        var files = e.target.files;
        for (i = 0; i < files.length; i++) {
            var file = files[i];
            console.log(file);
            if (file.type.match(/image.*/)) { //kijken of het wel een afbeelding is
                upload(file);
            } else {
                console.log('not an image');
                $('.icon-preview').empty().append('The file must be an image');
            }
        }
    }, false);
}


function upload(file) {

    /*
     *In Vanilla, anders werkt het niet deftig met ajax en image filetypes
     */

    if (!file || !file.type.match(/image.*/)) return;


    // Let's build a FormData object
    var fd = new FormData();
    fd.append("image", file); // Append the file

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        var xhr = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //het eigenlijke uploaden
    xhr.open("POST", "/upload");

    //loading indicator when loading
    // $('#preview').empty().append("<img src='/public/images/loading.gif' />");

    xhr.onreadystatechange = handleRequestStateChange;
    xhr.upload.onprogress = updateProgress;

    function handleRequestStateChange() {

        // als alles in orde is en geladen
        if (xhr.readyState == 4) {
            // continue only if HTTP status is "OK"
            if (xhr.status == 200) {
                $('.icon-preview').empty();
                try {
                    // retrieve the response
                    // var res = JSON.parse(xhr.responseText);
                    console.log(xhr.responseText);
                    $('.icon-preview').empty().append('<img src="/images/'+xhr.responseText+'.png">')
                    $('.block-icon-url').val('/images/'+xhr.responseText+'.png');
                    //
                } catch (e) {
                    // display error message
                    $('.icon-preview').empty().append("Error reading the server response: " + e.toString());
                }
            } else {
                // display status message
                $('.icon-preview').empty().append("There was a problem retrieving the data from the server:\n" +
                    xhr.statusText);
            }
        }
    }

    //Headers deftig zetten en data doorsturen
    xhr.setRequestHeader("enctype", "multipart/form-data");
    xhr.send(fd);

    function updateProgress(evt) {
        if (evt.lengthComputable) { //evt.loaded the bytes browser receive
            //evt.total the total bytes seted by the header
            //
            var percentComplete = (evt.loaded / evt.total) * 100 + '%';

            $('.progress-bar').css("width", percentComplete);
        }
    }

}

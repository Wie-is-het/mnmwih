/*
 *
 * For the uploading of images to Imgur
 *
 */
if (document.getElementById("imgInput") != undefined) {
    var files = document.getElementById("imgInput");

    //process files
    files.addEventListener("change", function (e) {
        var files = e.target.files;
        for (i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type.match(/image.*/)) { //kijken of het wel een afbeelding is
                upload(file);
            } else {
                $('#preview').empty().append('NOT AN IMAGE');
            }
        }
    }, false);
}

function upload(file) {

    /*
     *In Vanilla, anders werkt het niet deftig met ajax en image filetypes
     */

    if (!file || !file.type.match(/image.*/)) return;

    var keys = ['8ebd699a231710ad24b5efef627ec6cf7fb78194', '66bde52ced75967332715254605cb2f05e91641a','fcf82c8981a518bcacaccd16cb832d7df83ec7e7']

    // Let's build a FormData object
    var fd = new FormData();
    fd.append("image", file); // Append the file
    fd.append("key", keys[Math.floor(Math.random()*keys.length)]);


    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        var xhr = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //het eigenlijke uploaden
    xhr.open("POST", "https://api.imgur.com/3/upload.json");

    //loading indicator when loading
    $('#preview').empty().append("<img src='/public/img/012.gif' />&nbsp;Uploading...");

    xhr.onreadystatechange = handleRequestStateChange;

    function handleRequestStateChange() {

        // als alles in orde is en geladen
        if (xhr.readyState == 4) {
            // continue only if HTTP status is "OK"
            if (xhr.status == 200) {
                try {
                    // retrieve the response
                    var imgurLink = JSON.parse(xhr.responseText).data.link;
                    //console.log(imgurLink);
                    $('#preview').empty().append("<img src='" + imgurLink + "' alt='image'/>");
                    $('#img_url_result').val(imgurLink);
                    $('#img_url_result_thumb').val(imgurThumb(imgurLink,'b'));
                    $('.submit_with_photo').removeClass('disabled');
                } catch (e) {
                    // display error message
                    console.log("Error reading the response: " + e.toString());
                }
            } else {
                // display status message
                console.log("There was a problem retrieving the data:\n" +
                    xhr.statusText);
            }
        }
    }

    //Headers deftig zetten en data doorsturen
    xhr.setRequestHeader("authorization", "Client-ID 55c657eb81949e8");
    xhr.send(fd);

}
//  help-urls:
//  http://techslides.com/html5-image-zip-and-directory-upload-to-imgur/
//  http://www.cristiandarie.ro/asp-ajax/Async.html
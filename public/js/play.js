$(function() {
    $('.imgurImg').each(function() {
        src = $(this).attr('data-src');
        thumb = imgurThumb(src, 'b');
        $(this).attr('src', thumb);
    })

    var jsonHTML = $('#place-json').text();
    var locals = jsonHTML.replace(/&quot;/g, '"');
    locals = JSON.parse(locals);
    //console.log(locals.properties.people);

    for (var j = 0; j < locals.properties.people.length; j++) {
        localProps = locals.properties.people[j];
        //console.log(localProps);

        switch (localProps.name.toLowerCase()) {
            case 'sex':
                for (var i = 0; i < localProps.possibilities.length; i++) {
                    $('.questions').append('<div class="quest">Is it ' + localProps.possibilities[i] + '?</div>')
                };
                break;
            case "glasses":
                // for (var i = 0; i < localProps.possibilities.length; i++) {
                $('.questions').append('<div class="quest">Does it wear ' + 'glasses' + '?</div>')
                // };
                break;
            case 'facial hair':
                for (var i = 0; i < localProps.possibilities.length; i++) {
                    $('.questions').append('<div class="quest">Does he have a ' + localProps.possibilities[i] + '?</div>')
                };
                break;
            case 'hair color':
                for (var i = 0; i < localProps.possibilities.length; i++) {
                    $('.questions').append('<div class="quest">Does it have  ' + localProps.possibilities[i] + ' Hair?</div>')
                };
                break;
            case 'hair type':
                for (var i = 0; i < localProps.possibilities.length; i++) {
                    $('.questions').append('<div class="quest">Does it have  ' + localProps.possibilities[i] + ' Hair?</div>')
                };
                break;
            case 'accesories':
                for (var i = 0; i < localProps.possibilities.length; i++) {
                    $('.questions').append('<div class="quest">Does it accesorize with ' + localProps.possibilities[i] + '?</div>')
                };
                break;
            case 'eye color':
                for (var i = 0; i < localProps.possibilities.length; i++) {
                    $('.questions').append('<div class="quest">Does it have ' + localProps.possibilities[i] + ' eyes?</div>')
                };
                break;
            case 'skin color':
                for (var i = 0; i < localProps.possibilities.length; i++) {
                    $('.questions').append('<div class="quest">Is it ' + localProps.possibilities[i] + ' ?</div>')
                };
                break;
        }
    };

    var qArr = [];

    $('.quest').each(function() {
        //console.log($(this).html());
        qArr.push($(this).html());
    });

    $('.questions .quest').empty();

    //console.log(qArr);

    for (var i = 0; i < qArr.length; i++) {
        $('select.q').append('<option>' + qArr[i] + '</option>');
    };


    //Scaling .imgurImg 
   scaleImage('.object-item');


    function scaleImage(attribute){
        $(attribute).hover(function() {
            $(this).css("cursor", "pointer");
            $(this).animate({
                width: "20%"
            }, 'slow');

        }, function() {
            $(this).animate({
                width: "16.5%"
            }, 'slow');
        })
    }
})


/*
For getting thumbnails from imgur
*/

function imgurThumb(imgurl, size) {
    /*
size types:
s   Small Square    90x90   No
b   Big Square  160x160 No
t   Small Thumbnail 160x160 Yes
m   Medium Thumbnail    320x320 Yes
l   Large Thumbnail 640x640 Yes
h   Huge Thumbnail  1024x1024   Yes
*/

    var ext = imgurl.split('.').pop();
    var thumb = imgurl.substr(0, imgurl.lastIndexOf(".")) + size + "." + ext;
    return thumb;
}

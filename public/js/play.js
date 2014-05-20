//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //
//
//                  PLACE YOUR COMMENTS HERE
//
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //

var one, settings;

$(function() {
    $('.imgurImg').each(function() {
        src = $(this).attr('data-src');
        thumb = imgurThumb(src, 'b');
        $(this).attr('src', thumb);
    })

    var jsonHTML = $('#place-json').text();
    var locals = jsonHTML.replace(/&quot;/g, '"');      //-----> PARSING THE JSON FROM THE PAGE
    locals = JSON.parse(locals);

    var oneHTML = $('#place-json2').text();
    var theOne = oneHTML.replace(/&quot;/g, '"');       //-----> PARSING THE JSON FROM THE PAGE
    one = JSON.parse(theOne);
    $('#place-json2').empty();
	
	var settingsHTML = $('#place-json3').text();
	var theSettings = settingsHTML.replace(/&quot;/g, '"');       //-----> PARSING THE JSON FROM THE PAGE
	settings = JSON.parse(theSettings);
	
	console.log(settings);

    //console.log(locals.properties.people);

    $('.questions').empty();

    var qString = '<h2>Questions</h2>'; //-----> BUILDING A STRING TO ECHO IN THE QUESTIONS BOX

    for (var j = 0; j < locals.length; j++) {
        localProps = locals[j];

        var name = localProps.name;
        var possibles = localProps.possibilities;

        qString += '<h5>' + name + ' ? </h5>';

        qString += '<div style="word-wrap:break-word;">';
        for (var i = 0; i < possibles.length; i++) {
            qString += '<a href="#" class="quest" data-type="' + name + '" data-what="' + possibles[i] + '">' + possibles[i] + '</a>&nbsp;&nbsp;';
            //settings.questionsLeft++;
        };
        qString += '</div>';
    };

    qString += ('<br><br>')

    $('.questions').html(qString);

    // var qArr = [];

    // $('.quest').each(function() {
    //     //console.log($(this).html());
    //     qArr.push($(this).html());
    // });

    // $('.questions').empty();

    // //console.log(qArr);

    // for (var i = 0; i < qArr.length; i++) {
    //     $('.questions').append('<a href="#">' + qArr[i] + '</a><br>');
    // };

    //Scaling .imgurImg
    //scaleImage('.object-item');


    // function scaleImage(attribute) {
    //     $(attribute).hover(function() {
    //         $(this).css("cursor", "pointer");
    //         $(this).animate({
    //             width: "20%"
    //         }, 'slow');
                                                        //-----------> Replaced by lightbox
    //     }, function() {
    //         $(this).animate({
    //             width: "16.5%"
    //         }, 'slow');
    //     })
    // }
    //for (var x = Things.length - 1; x >= 0; x--) {
    //    $(".photos .object-item:nth-child(" + x + ")").addClass('col-md-offset-1');
    //};
    //$(".photos .object-item:nth-child(5n+1)").addClass('col-md-offset-1');

    // console.log(one.properties)

    var onePropNames = []; //some handling for when the clicked answer properties aren't in the properties of the one
    for (var key in one.properties) {
        var propName = key.toLowerCase();
        onePropNames.push(key);
    };

    $(document).on('click', '.quest', function() {
        if (!$(this).hasClass('disabled')) { // see if the answer has been asked and thus has the class disabled
            var thisData = $(this).data();

            settings.questionsLeft--;    //update te stats
            updateStats();

            for (var key in one.properties) {   //iterate through the properties of the correct answer (the one)

                if (thisData.type.toLowerCase() == key.toLowerCase()) { // see if properties for the one and the question asked are of the same type (vb: hair, eye color, ...)

                    // console.log('testing for shizzle');
                    if (thisData.what.toLowerCase() == one.properties[key].toLowerCase()) { //compare the values of the one and the answer clicked
                        // alert('correct')
                        $(this).addClass('correct');
                        $(this).addClass('disabled');

                    } else {
                        // if the answer is incorrect
                        $(this).addClass('incorrect');
                        $(this).addClass('disabled')
                    }
                } else if (!inArray(thisData.type.toLowerCase(), onePropNames)) {//some handling for when the clicked answer properties aren't in the properties of the one
                    console.log('not applicable');
                    $(this).addClass('incorrect');
                    $(this).addClass('disabled')
                }
            };
        }
        // console.log($(this).data().type)
    })

    $('.btn-answer').click(function() {
        checkAnswer();
    })

    updateStats();
})

function checkAnswer(){
    //-----> THIS ONE SPEAKS FOR ITSELD
     var userInput = $('.answer-input').val();
        // console.log(userInput, one.name)
        if (userInput.toLowerCase() == one.name.toLowerCase()) {
            UserAnsweredCorrectly();
        } else {
            settings.answersLeft--;
            UserAnsweredWrong();
        }
        updateStats();
}

function updateStats() {
	//console.log(settings.questionsLeft);
    $('.attemps_left').html(settings.answersLeft);
    $('.questions_left').html(settings.questionsLeft);
}

function UserAnsweredCorrectly() {
    alert('U heeft gewonnen met nog ' + settings.answersLeft + ' pogingen over, wilt u dit delen op Facebook?')
}

function UserAnsweredWrong() {
    alert('U heeft niet gewonnen, \nU heeft nog' + settings.answersLeft + ' pogingen over')
}


//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //

//       DON'T FORGET TO MINIFY FOR PRODUCTION, SO THIS CODE WILL BE UNREADABLE AND MORE DIFFICULT TO HACK      //

//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //





/*

HELPER FUNCTIONS, please ignore


 */
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

//for seeing if an item is in an array

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

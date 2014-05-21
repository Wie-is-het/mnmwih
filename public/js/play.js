//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //
//
//                  PLACE YOUR COMMENTS HERE
//
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //

var one, settings, answersLeft, questionsLeft;

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
	
	// Initial value of answer attempts
	answersLeft = settings[0]["value"];
	
	// Initial value of questions attemps
	questionsLeft = settings[1]["value"];
	
	//console.log(settings[1]["value"]);

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
            //questionsLeft++;
        };
        qString += '</div>';
    };

    qString += ('<br><br>')

    $('.questions').html(qString);

    var onePropNames = []; //some handling for when the clicked answer properties aren't in the properties of the one
    for (var key in one.properties) {
        var propName = key.toLowerCase();
        onePropNames.push(key);
    };

    $(document).on('click', '.quest', function() {
        if (!$(this).hasClass('disabled')) { // see if the answer has been asked and thus has the class disabled
            var thisData = $(this).data();

            questionsLeft--;    //update te stats
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
                    //console.log('not applicable');
                    $(this).addClass('incorrect');
                    $(this).addClass('disabled')
                }
            };
        }
        // console.log($(this).data().type)
    }); 


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
            if (answersLeft >= 2){
                answersLeft--;
                UserAnsweredWrong();
            }else{
                DisplayPlayButton();
                ShowNotification('Oops! Geen pogingen over. Speel nog een keer!', "#138BD3");
            }
            UserAnsweredWrong();
        }
        updateStats();
}

function updateStats() {
	//console.log(questionsLeft);
    $('.attemps_left').html(answersLeft);
    $('.questions_left').html(questionsLeft);
}

function UserAnsweredCorrectly() {
 
    ShowNotification('U heeft gewonnen met nog ' + answersLeft + ' pogingen over. Wilt u dit delen op Facebook?', "#09306C");
}

function UserAnsweredWrong() {
    
    ShowNotification('U heeft niet gewonnen, \nU heeft nog ' + answersLeft + ' pogingen over. Speel nog een keer!', "#D9001B");
    
}

function ShowNotification(text, bgcolour) {
    var text = text;
    var bgcolour = bgcolour;

    $('.text').css("display", "block");

    var $err = $('.text').addClass('error-notification')
                         .html(text)
                         .css('background-color', bgcolour);
    $(this).after($err);
    $err.fadeIn('slow');

    // $('.error-notification').on('click', function() {
    //     console.log("I can click!");
    //     $(this).fadeOut('fast', function() { $(this).remove(); });
    // });
}



function PlayAgain() {
    console.log("play again");
    $('.btn-again').css("display", "none");
    $('.text').css("display", "none");

    answersLeft = settings[0]["value"];
    questionsLeft = settings[1]["value"];
    updateStats();

    if($(this).hasClass('disabled')){
        var thisData = $(this).data();
        $(this).removeClass('disabled');
        $(this).removeClass('incorrect');
        $(this).removeClass('correct');
    }

    updateStats();
}

function DisplayPlayButton(){
    $('.btn-again').css("display", "block");
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

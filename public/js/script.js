var blob = new Object();
blob.categorie = "people";
blob.properties = new Object;

$(function() {
    $('.categorie-link').on('click', function() {
        //UI
        $('.categorie-link').removeClass('active');
        $(this).addClass('active');

        //logic
        var clicked = $(this).data('categorie').toLowerCase();

        blob.categorie = clicked;

        //UI
        $('.attribute-options').hide();
        $('.' + clicked + '-options').show();
    })

    $('.property').on('click',function(){
        //logic
        var group = $(this).data('group');
        var value = $(this).data('value');

        //UI
        $(this).parent().parent().children().children('.property').removeClass('active');
        // console.log($(this).parent().parent().children().children('.property'))
        $(this).addClass('active');

        //logic
        blob.properties[group] = value;
        // console.log(blob);

    })

    $('.property').click(function(){
        $('.submit-bn').removeClass('hiddenStuff');
    })

    //to prevent the page from jumping when clicking on '#' links
    $('a[href="#"]').click(function(event){
        event.preventDefault();
    });

    $('#saveForm').on('submit',function(e){
        e.preventDefault();
        if(pageValid()){
            console.log('all valid');
            blob.name = $('#image-name').val();
            blob.image = $('#img_url_result').val();
            saveToDB();
        }else{
            console.log('not al lvalid');
            return false;
        }
    })
    
})



///////////////////////
/// Saving to DB     //
///////////////////////
///
function saveToDB() {
        var index = 0;

        postData = blob;

        var d = JSON.stringify(postData);

        //sending the object to the back-end
        $.ajax({
            type: 'POST',
            url: '/upload',
            data: d,
            "content-type": "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                // var data = eval('(' + r+ ')');
                console.log(data);
                alert('you have succesfully added your object');
                window.location.replace("/play");
            },
            error: function(e) {
                var status, statusText;
                if (e.status > 400) {
                    status = "danger";
                    statusText = "Error";
                     console.warn(e.responseText);
                } else {
                    alert('you have succesfully added your object');
                    window.location.replace("/play");
                    status = "success"
                    statusText = "Success";
                };
                var alertbox = '<div class="alert alert-' + status + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + statusText + ': </strong>' + e.responseText + '</div>';
                $('.error').append(alertbox);
            }
        })
    }

//validating front-end
function pageValid(){

    var valid = true;
    // console.log($('.categories').children('ul').children('li').children('a.active').length);

    if($('#img_url_result').val() == ''){
        $('#preview').html('<span style="color:red;text-transform: uppercase;">Please upload an image</span>');
            valid= false;
    }

    if($('#image-name').val() == ''){
        $('#image-name').addClass('red-border');
        valid= false;
    }else{
        $('#image-name').removeClass('red-border');
    }

    if($('.categories').children('ul').children('li').children('a.active').length < 1){
        alert('please pick a category');
        valid= false;
    }

    var category = $('.categories .active').data('categorie').toLowerCase();
    $('.'+category+'-options').each(function(){
        var activePills = $(this).children('.group').children('ul').children('li').children('a.active').length;
        if(activePills == 0){
            alert('Please choose at least one attribute');
            valid= false;
        }
    })

    return valid;
}














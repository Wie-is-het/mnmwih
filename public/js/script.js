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
        console.log($(this).parent().parent().children().children('.property'))
        $(this).addClass('active');

        //logic
        blob.properties[group] = value;
        console.log(blob);

    })
})

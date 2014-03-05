initializeGrid(false);

$(function() {

    $('#block-add-form').on('submit', function(e) {
        e.preventDefault();

        var width = $('#block-width-select').val();
        var height = $('#block-height-select').val();
        var text = $('#block-text-select').val();
        var color = $('#block-color-select').val();
        var link = $('#block-link-select').val();
        var icon = $('.block-icon-url').val();

        var block = '<div class="block" data-ss-colspan="' + width + '" data-ss-rowspan="' + height + '"';
        block += 'data-link="' + link + '"';
        block += 'style="background-color:' + color + '"';
        block += '>';
        block += '<div class="block-icon" data-url="' + icon + '"><img src="' + icon + '"></div>';
        block += '<div class="block-remove">&times;</div>';
        block += '<div class="block-text">' + text + '</div>';
        block += '</div>'

        $('.block-container').append(block);

        initializeGrid(true);
    })

    $(document).on('click', '.block-remove', function() {
        $(this).parent().remove();
        initializeGrid(true);
    })

    $('.shuffle').click(function() {
        $(".block-container").trigger("ss-shuffle")
    })

    $('.destroy').click(function() {
        $(".block-container").empty();
        $(".block-container").trigger("ss-shuffle")
    })

    $('.tiles-save').click(function() {
        var index = 0;
        var saveObj = [];
        $('.block').each(function() {
            var obj = new Object
            var blck = $(this);
            obj.index = index;
            obj.width = blck.data('ss-colspan');
            obj.height = blck.data('ss-rowspan');
            obj.color = rgb2hex(blck.css('background-color'));
            obj.link = blck.data('link');
            obj.text = blck.children('.block-text').html();
            obj.icon = blck.children('.block-icon').data('url');
            index++;
            saveObj.push(obj);
        })
        console.log(saveObj);

        //make object with name and stuff
        var postData = new Object();
        postData.tiles = saveObj;
        console.log(postData);
        $.ajax({
            url: '/admin/save',
            type: 'GET',
            // contentType: 'application/json',
            dataType: 'text/json',
            data: JSON.stringify(postData)
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

    })
})

function initializeGrid(animate) {
    $(".block-container").shapeshift({
        minColumns: 4,
        minRows: 8,
        enableDrag: true,
        enableCrossDrop: true,
        animateOnInit: animate
    });
}

//	//	//	//	//	//
// Helper Functions
//	//	//	//	//	//

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

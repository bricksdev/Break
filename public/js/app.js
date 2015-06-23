//$(document).ready(function () {
//
//    $('#tags').tagsInput({
//        height: '60px',
//        width: '100%'
//    });
//
//    $('#relusers').tagsInput({
//        height: '60px',
//        width: '100%'
//    });
//});

/**
 * tags setting
 * @param {type} fieldoptions [{field:fieldname,option:{}}]
 * @returns {undefined}
 */
var AppTagsInput = function (fieldoptions) {
    if (fieldoptions && $.isArray(fieldoptions)) {
        var option = {
            height: '60px',
            width: 'auto'
        };
        $(document).ready(function () {


            $.each(fieldoptions, function (index) {
                var fieldOption = fieldoptions[index]["option"];
                for (key in fieldOption) {
                    option[key] = fieldOption[key];
                }
                $('#' + fieldoptions[index]["field"]).tagsInput(option);
            });

        });
    }
};
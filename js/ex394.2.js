$('#rus11h p input[type="text"]').each(function(){
    var x = $(this);
    if (!x.attr('value')) {
        x.attr('value', '_');
    }
});

$(document).ready(function(){
    function doIt() {
        var showAnswers = $('#rus11h input.correct, #rus11h input.incorrect').length;
        if (showAnswers) {
            $('#rus11h p')
                .addClass('showAnswers')
                .off('mouseenter mouseleave');
            $('#rus11h p > b').each(function(){
                var b = $(this),
                    input = b.next('q').find('input[type="text"]').first();
                if (input.hasClass('correct') && input.attr('value') === 'X') {
                    b.addClass('correct');
                } else if (input.hasClass('incorrect')) {
                    b.addClass('incorrect');
                }
            });
            $('#rus11h p > i').each(function(){
                var i = $(this),
                    input = i.next('q').find('input[type="text"]').first();
                if (input.hasClass('correct') && input.attr('value') === 'X') {
                    i.html(', <i></i>');
                    i.addClass('correct');
                } else if (input.hasClass('incorrect')) {
                    if (input.attr('value') === 'X') {
                        i.html(', <i></i>');
                    } else {
                        i.append('<i></i>');
                    }
                    i.addClass('incorrect');
                }
            });
        }
    }
    setTimeout(doIt, 1000);
});

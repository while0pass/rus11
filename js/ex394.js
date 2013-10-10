$('#rus11h p').mouseenter(function(){
    $(this).children('i').append('<i></i>');
}).mouseleave(function(){
    $(this).find('i i').remove();
});

$('#rus11h p > b, #rus11h p > i').click(function(){
    var x = $(this),
        input = x.next('q').find('input[type="text"]');
    if (input.attr('value') === '_') {
        input.attr('value', 'X');
    } else {
        input.attr('value', '_');
    }
});

$('#rus11h p > b').click(function(){
    var x = $(this),
        cnvs = x.find('canvas')[0];
    if (cnvs) {
        cnvs.remove();
        x.removeClass('underlined');
        return;
    } else {
        x.addClass('underlined');
        cnvs = x.append('<canvas></canvas>').find('canvas')[0];
    }

    var ctx = cnvs.getContext('2d'),
        width = cnvs.clientWidth,
        hRadius = 3.5,
        vRadius = 2.5,
        startX = hRadius * -3;
    cnvs.width = width;
    cnvs.height = '10';
    ctx.strokeStyle = '#ca8f42';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, vRadius + 1);
    for (var i = startX; i < width; i += hRadius * 4) {
        ctx.bezierCurveTo(i, 1,
                          i + hRadius * 2, 1,
                          i + hRadius * 2, vRadius + 1);
        ctx.bezierCurveTo(i + hRadius * 2, 2 * vRadius + 1,
                          i + hRadius * 4, 2*vRadius + 1,
                          i + hRadius * 4, vRadius + 1);
    }
    ctx.stroke();
});

$('#rus11h p i').click(function(){
    var txt = $(this).text();
    if (txt.replace(/\s*/g, '')) {
        $(this).text(' ');
        $(this).removeClass('comma');
    } else {
        $(this).text(', ');
        $(this).addClass('comma');
    }
});


{% if HTML %}

    $('#rus11h p q')
        .replaceWith('<q><span class="subquestion">' +
                 '<input type="text" class="incorrect" value="_"/></span></q>');

{% endif %}


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

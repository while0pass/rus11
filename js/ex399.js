(function (q, $) {
    var puMap = {
        '':  0,
        ' ': 0,
        ',': 1,
        ';': 2,
        ':': 3,
        '\u2013': 4,
        '\u2014': 4,
        '-': 5,
        '?': 6,
        '!': 7,
        '.': 8,
        '«': 9,
        '»': 9,
    };

    $('#rXI---textarea').html(q.te);
    $('#rXI---author').html(q.au);

    function getWords(text) {
        return text.match(/[а-яА-Я0-9]+/g);
    }

    function getBlanks(text) {
        var blanks = text.match(/[\s\.\,\:\;\-\u2013\u2014\?\!]+|^/g),
            words = getWords(text);
        if (blanks.length === words.length) blanks.push('');
        if (blanks.length !== words.length + 1) throw new Error('b!w+1');
        return blanks;
    }

    function getPuNumbers(text) {
        var pu = getBlanks(text);
        pu.forEach(function (item, index, array) {
            // TODO: Случаи неправильной отбивки знаков препинания
            // не учитываются. Таким образом, в данный момент последовательности
            // наподобие ЗАПЯТАЯ-ПРОБЕЛ и ПРОБЕЛ-ЗАПЯТАЯ-ПРОБЕЛ считаются
            // эквивалентными.
            array[index] = puMap[item.replace(/^\s*|\s*$/g, '')];
        });
        return pu;
    }

    function getPuSlug(text) {
        var pu = getBlanks(text);
        pu.forEach(function (item, index, array) {
            array[index] = item.replace(/^\s*|\s*$/g, '') || '_';
        });
        return pu.join('');
    }

    var pNum = q.ma.reduce(function (x, y) { return x + y; }),
        words = getWords(q.te);

    $(document).ready(function(){
        function doIt() {
            var showAnswers = $('#rXI---main input.correct,' +
                                '#rXI---main input.incorrect').length;
            if (showAnswers) {
                $('#rXI---textarea').attr('contenteditable', false);
                $('#rXI---textarea').addClass('.rXI---showAnswers');
            } else {
            }
        }
        setTimeout(doIt, 1000);
    });

    function score(l1, l2, lt, n) {
        var x = 0, i, j;
        if (l1.length !== l2.length) throw new Error('l1l!l2l');
        for (i=0, j=l1.length; i<j; i++) {
            if (l1[i] === l2[i]) {
                // TODO...
            }
        }
        return x;
    }

    function changeAnswer() {
        var text = $('#rXI---textarea').text(),
            slugInput = $('#rXI---slug').find('input[type="text"]'),
            scoreInput = $('#rXI---score').find('input[type="text"]');

        slugInput.attr('value', getPuSlug(text));
        scoreInput.attr('value', score(getPuNumbers, q.pu, q.ma, pNum));
        console.log(scoreInput.attr('value'));
    }

    $('#rXI---textarea').keyup(changeAnswer);

})(rXI$h, jQuery);

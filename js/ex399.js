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
        },
        textareaInput = $('#rXI---textarea'),
        slugInput = $('#rXI---slug').find('input[type="text"]'),
        scoreInput = $('#rXI---score').find('input[type="text"]'),
        authorElem = $('#rXI---author');
        slugSeparator = '|';


    textareaInput.html(q.te);
    authorElem.html(q.au);

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

    function getPuNumbers(pu) {
        var numbers = [], i, j;
        for (i=0, j=pu.length; i<j; i++) {
            // TODO: Случаи неправильной отбивки знаков препинания
            // не учитываются. Таким образом, в данный момент последовательности
            // наподобие ЗАПЯТАЯ-ПРОБЕЛ и ПРОБЕЛ-ЗАПЯТАЯ-ПРОБЕЛ считаются
            // эквивалентными.
            numbers.push(puMap[pu[i].replace(/^\s*|\s*$/g, '')]);
        }
        return numbers;
    }

    function getPuSlug(text) {
        var pu = getBlanks(text);
        return pu.join(slugSeparator);
    }

    function getScore(l1, l2, mask) {
        var i, j,
            maxscore = 10,
            increment = maxscore / mask.reduce(function (a, b) { return a + b; }),
            x = maxscore;

        if (l1.length !== l2.length) throw new Error('l1l!l2l');
        for (i=0, j=l1.length; i<j; i++) {
            if (l1[i] !== l2[i]) {
                x -= increment;
            }
        }
        return Math.ceil(x);
    }

    function changeAnswer() {
        var text = textareaInput.text(),
            score = getScore(getPuNumbers(getBlanks(text)), q.pu, q.ma);

        slugInput.attr('value', getPuSlug(text));
        scoreInput.attr('value', score);
    }

    textareaInput.keyup(changeAnswer);

    function getTextWithAnswers() {
        var words = getWords(q.te),
            pu = slugInput.attr('value').split(slugSeparator),
            puNumbers = getPuNumbers(pu),
            html = '',
            i, j;
        for (i=0, j=puNumbers.length; i<j; i++) {
            if (puNumbers[i] !== q.pu[i]) {
                pu[i] = '<span class="bad">' + pu[i] + '</span>';
            } else if (q.ma[i]) {
                pu[i] = '<span class="good">' + pu[i] + '</span>';
            }
        }
        for (i=0, j=words.length; i<j; i++) {
            html += words[i] + pu[i+1];
        }
        html = pu[0] + html;
        return html
    }

    if (!slugInput.attr('value')) {
        changeAnswer();
    } else {
        textareaInput.attr('contenteditable', false);
        textareaInput.html(getTextWithAnswers());
    }

    {% if HTML %}
        authorElem.dblclick(function () {
            slugInput.toggleClass('correct');
            if (slugInput.hasClass('correct')) {
                textareaInput.attr('contenteditable', false);
                textareaInput.html(getTextWithAnswers());
            } else {
                textareaInput.attr('contenteditable', true);
                textareaInput.html(q.te);
                changeAnswer();
            }
        });
    {% endif %}

})(rXI$h, jQuery);

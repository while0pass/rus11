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
        slugSeparator = '|',
        whichMarker = null;


    $('.rXI---markers a').click(function () {
        var x = $(this),
            cls = x.attr('class');
        if ($('#rXI---main').hasClass(cls)) {
            $('#rXI---main').removeClass('rXI---blueMarker rXI---greenMarker');
            whichMarker = null;
        } else {
            $('#rXI---main')
                .removeClass('rXI---blueMarker rXI---greenMarker')
                .addClass(cls);
            whichMarker = cls;
        }
    });

    function markupWordsAndBlanks(text) {
        var wordChars = 'а-яА-Я0-9',
            wordRE = new RegExp('^[' + wordChars + ']+'),
            nonWordRE = new RegExp('^[^' + wordChars + ']*'),
            i = 0, match, count = 0,
            html = '';

        while (true) {
            count += 1;
            match = nonWordRE.exec(text.slice(i));
            html += '<span class="rXI---nonWord" ' +
                'data-order="' + count + '">' + match[0] + '</span>';
            i = i + match[0].length;
            match = wordRE.exec(text.slice(i));
            if (match !== null) {
                html += '<span class="rXI---word" contenteditable="false"' +
                    'data-order="' + count + '">' + match[0] + '</span>';
                i = i + match[0].length;
            } else {
                break;
            }
        }
        return html;
    }

    {% if HTML %} console.log(markupWordsAndBlanks(q.te)); {% endif %}

    textareaInput.html(markupWordsAndBlanks(q.te));
    authorElem.html(q.au);


    function processSelection() {
        var sel = document.getSelection();
        if (whichMarker) {
            var start = $(sel.anchorNode).closest('.rXI---word, .rXI---nonWord'),
                end = $(sel.focusNode).closest('.rXI---word, .rXI---nonWord');

            if (sel.isCollapsed) {
                var selid = start.attr('data-selid');
                if (selid) {
                    $('[data-selid="' + selid + '"]')
                        .removeClass(selid.split(/[0-9]+/)[0])
                        .removeAttr('data-selid');
                    return false;
                }
            }
            sel.removeAllRanges();

            var isStartWord = start.is('.rXI---word');
            var isEndWord = end.is('.rXI---word');
            var startOrder = parseInt(start.attr('data-order'));
            var endOrder = parseInt(end.attr('data-order'));

            if (startOrder < endOrder) {
                direction = 'right';
            } else if (startOrder > endOrder) {
                direction = 'left';
            } else {
                direction = isStartWord ? 'left' : 'right';
                //  Случай, когда ни одно слово не выделено.
                if (!isStartWord && !isEndWord) {
                    return false;
                }
            }

            if (!isStartWord) {
                start = start[direction === 'right' ? 'next':'prev']('.rXI---word');
                isStartWord = !isStartWord;
            }
            if (!isEndWord) {
                end = end[direction === 'right' ? 'prev':'next']('.rXI---word');
                isEndWord = !isEndWord;
            }

            var temp = start;
            if (direction === 'left') {
                start = end;
                end = temp;
            }

            while (typeof start.get(0) !== 'undefined' &&
            parseInt(start.attr('data-order')) <= parseInt(end.attr('data-order'))) {
                start.prevAll('.maybeMarked')
                    .removeClass('rXI---blueMarker rXI---greenMarker')
                    .removeClass('maybeMarked')
                    .addClass(whichMarker)
                    .attr('data-selid', whichMarker + processSelection.counter);
                if (start.is('[data-selid]') &&
                start.attr('data-selid') !== whichMarker + processSelection.counter) {
                    $('[data-selid="' + start.attr('data-selid') + '"]')
                        .removeClass('rXI---blueMarker rXI---greenMarker')
                        .addClass(whichMarker)
                        .attr('data-selid', whichMarker + processSelection.counter);
                } else {
                    start
                        .removeClass('rXI---blueMarker rXI---greenMarker')
                        .addClass(whichMarker)
                        .attr('data-selid', whichMarker + processSelection.counter);
                }
                start = start.nextAll('.rXI---nonWord').first();
                start.addClass('maybeMarked');
                start = start.nextAll('.rXI---word').first();
            }
            start.prevAll('.maybeMarked').removeClass('maybeMarked');
            processSelection.counter++;
        } else {
            return false;
        }
    }
    processSelection.counter = 0;

    textareaInput.on('dragstart', function () { return false; });
    textareaInput.on('mouseup', processSelection);










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
                pu[i] = '<span class="bad">' + pu[i] + '<canvas/></span>';
            } else if (q.ma[i]) {
                pu[i] = '<span class="good">' + pu[i] + '<canvas/></span>';
            }
        }
        for (i=0, j=words.length; i<j; i++) {
            html += words[i] + pu[i+1];
        }
        html = pu[0] + html;
        return html
    }

    function adjustCanvas() {
        textareaInput.find('.bad canvas').each(function () {
            var ctx = this.getContext('2d'),
                width = $(this).parent().width() + 10;

            $(this).width(width);
            this.width = width;
            this.height = 5;
            ctx.strokeStyle = 'red';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.bezierCurveTo(0, 2,
                              width * 3 / 2, 0,
                              width, 0);
            ctx.stroke();
        });
        textareaInput.find('.good canvas').each(function () {
            var ctx = this.getContext('2d'),
                width = $(this).parent().width() + 10;

            $(this).width(width);
            this.width = width;
            this.height = 5;
            ctx.strokeStyle = 'green';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.bezierCurveTo(0, 2,
                              width * 3 / 2, 0,
                              width, 0);
            ctx.stroke();
        });
    }

    if (!slugInput.attr('value')) {
        changeAnswer();
    } else {
        textareaInput.attr('contenteditable', false);
        textareaInput.html(getTextWithAnswers());
        adjustCanvas();
    }

    {% if HTML %}
        authorElem.dblclick(function () {
            slugInput.toggleClass('correct');
            if (slugInput.hasClass('correct')) {
                textareaInput.attr('contenteditable', false);
                textareaInput.html(getTextWithAnswers());
                adjustCanvas();
            } else {
                textareaInput.attr('contenteditable', true);
                textareaInput.html(q.te);
                changeAnswer();
            }
        });
    {% endif %}

})(rXI$h, jQuery);

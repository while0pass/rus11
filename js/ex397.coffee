do (q=rXI$h, $=jQuery) ->

    puMap =
        '':  0
        ' ': 0
        ',': 1
        ';': 2
        ':': 3
        '\u2013': 4
        '\u2014': 4
        '-': 5
        '?': 6
        '!': 7
        '.': 8
        '«': 9
        '»': 9
    textareaInput = $('#rXI---textarea')
    slugInput = $('#rXI---slug').find 'input[type="text"]'
    scoreInput = $('#rXI---score').find 'input[type="text"]'
    authorElem = $('#rXI---author')
    slugSeparator = '|'
    whichMarker = null

    markupWordsAndBlanks = (text) ->
        wordRE = /^[а-яА-Я0-9]+/
        nonWordRE = /^[^а-яА-Я0-9]*/
        count = i = 0
        html = ''

        while true
            count += 1
            match = nonWordRE.exec text.slice i
            html += """<span class='rXI---nonWord'
                    data-order='#{ count }'>#{ match[0] }</span>"""
            i = i + match[0].length
            match = wordRE.exec text.slice i
            break if match is null
            html += """<span class='rXI---word'
                    data-order='#{ count }'>#{ match[0] }</span>"""
            i = i + match[0].length
        html

    updateSelectionQuizResults = (element) ->
        el = $(element)
        ranges = {}

        $('.rXI---markers a').each ->
            ranges[$(@).attr 'class'] = []

        for word in el.find('.rXI---word')
            x = $ word
            currentSelid = x.attr 'data-selid'
            currentMarker = currentSelid?.replace /[0-9]+$/, ''
            order = x.attr 'data-order'

            if not start and currentSelid
                start = order
                end = null
                selid = currentSelid
            else if start and currentSelid
                if selid isnt currentSelid
                    end = '' + (parseInt(order) - 1)
                    ranges[selid.replace /[0-9]+$/, ''].push(start + '-' + end)
                    start = order
                    end = null
                    selid = currentSelid
            else if start and not currentSelid
                end = '' + (parseInt(order) - 1)
                ranges[selid.replace /[0-9]+$/, ''].push(start + '-' + end)
                start = null
                end = null
                selid = null

        if start
            end = order
            ranges[selid.replace /[0-9]+$/, ''].push(start + '-' + end)

        for x in el.nextAll('.rXI---selection')
            x = $ x
            markerRanges = ranges[x.attr 'data-marker']
            markerIndex = parseInt(/[0-9]+/.exec(x.attr 'data-marker')[0]) - 1
            rightRanges = q.se[markerIndex].split ','
            slug = markerRanges.join()
            score = 0
            markerRanges.push '' if markerRanges.length == 0
            for i in markerRanges
                weight = if rightRanges.indexOf(i) > -1 then 1 else -1
                score += 10 / rightRanges.length * weight
            score = Math.ceil score
            score = 0 if score < 0
            throw new Error 'Score can not be more than 10.' if score > 10
            x.find('input').first().attr 'value', slug
            x.find('input').last().attr 'value', score

    processSelection = ->
        sel = document.getSelection()
        element = @
        if whichMarker
            start = $(sel.anchorNode).closest '.rXI---word, .rXI---nonWord'
            end = $(sel.focusNode).closest '.rXI---word, .rXI---nonWord'
            console.log start.is('.rXI---word, .rXI---nonWord'), end.is('.rXI---word, .rXI---nonWord')

            if sel.isCollapsed
                selid = start.attr 'data-selid'
                if selid
                    $("[data-selid='#{ selid }']")
                        .removeClass(selid.replace /[0-9]+$/, '')
                        .removeAttr 'data-selid'
                    updateSelectionQuizResults element
                    return false
            sel.removeAllRanges()

            isStartWord = start.is '.rXI---word'
            isEndWord = end.is '.rXI---word'
            startOrder = parseInt start.attr 'data-order'
            endOrder = parseInt end.attr 'data-order'

            if startOrder < endOrder
                direction = 'right'
            else if startOrder > endOrder
                direction = 'left'
            else
                direction = if isStartWord then 'left' else 'right'
                # Случай, когда ни одно слово не выделено.
                if not isStartWord and not isEndWord
                    updateSelectionQuizResults element
                    return false

            if not isStartWord
                traverseOp = if direction is 'right' then 'next' else 'prev'
                start = start[traverseOp]('.rXI---word')
                isStartWord = true
            if not isEndWord
                traverseOp = if direction is 'right' then 'prev' else 'next'
                end = end[traverseOp]('.rXI---word')
                isEndWord = true

            [start, end] = [end, start] if direction is 'left'

            while typeof start.get(0) isnt 'undefined' and
            parseInt(start.attr 'data-order') <= parseInt end.attr 'data-order'
                selid = whichMarker + processSelection.counter
                start.prevAll('.maybeMarked')
                    .removeClass('rXI---1Marker rXI---2Marker')
                    .removeClass('maybeMarked')
                    .addClass(whichMarker)
                    .attr 'data-selid', selid
                if start.is('[data-selid]') and
                start.attr('data-selid') isnt selid
                    $("[data-selid='#{ start.attr('data-selid') }']")
                        .removeClass('rXI---1Marker rXI---2Marker')
                        .addClass(whichMarker)
                        .attr 'data-selid', selid
                else
                    start
                        .removeClass('rXI---1Marker rXI---2Marker')
                        .addClass(whichMarker)
                        .attr 'data-selid', selid
                start = start.nextAll('.rXI---nonWord').first()
                start.addClass 'maybeMarked'
                start = start.nextAll('.rXI---word').first()
            start.prevAll('.maybeMarked').removeClass 'maybeMarked'
            processSelection.counter++
        updateSelectionQuizResults element
        false
    processSelection.counter = 0

    getWords = (text) ->
        text.match /[а-яА-Я0-9]+/g

    getBlanks = (text) ->
        blanks = text.match /[\s\.\,\:\;\-\u2013\u2014\?\!]+|^/g
        words = getWords text
        blanks.push '' if blanks.length is words.length
        throw new Error 'b!w+1' if blanks.length isnt words.length + 1
        blanks

    getPuNumbers = (pu) ->
        # TODO: Случаи неправильной отбивки знаков препинания
        # не учитываются. Таким образом, в данный момент последовательности
        # наподобие ЗАПЯТАЯ-ПРОБЕЛ и ПРОБЕЛ-ЗАПЯТАЯ-ПРОБЕЛ считаются
        # эквивалентными.
        (puMap[x.replace /^\s*|\s*$/g, ''] for x in pu)

    getPuSlug = (text) ->
        pu = getBlanks text
        pu.join slugSeparator

    getScore = (l1, l2, mask) ->
        maxscore = 10
        increment = maxscore / mask.reduce (a, b) -> a + b
        x = maxscore
        throw new Error 'l1l!l2l' if l1.length isnt l2.length
        for i in [0...l1.length]
            x -= increment if l1[i] isnt l2[i]
        Math.ceil x

    changeAnswer = ->
        text = textareaInput.text()
        score = getScore getPuNumbers(getBlanks text), q.pu, q.ma
        slugInput.attr 'value', getPuSlug text
        scoreInput.attr 'value', score

    getTextWithAnswers = ->
        textareaInput.html markupWordsAndBlanks q.te
        pu = slugInput.attr('value').split slugSeparator
        puNumbers = getPuNumbers pu
        for i in [0...puNumbers.length]
            x = textareaInput.find(".rXI---nonWord[data-order='#{ i+1 }']")
            x.html(pu[i])
            if puNumbers[i] isnt q.pu[i]
                x.addClass('bad')
                x.append('<canvas class="puCorrectness"/>')
            else if q.ma[i]
                x.addClass('good')
                x.append('<canvas class="puCorrectness"/>')
        textareaInput.html()

    adjustCanvas = ->
        textareaInput.find('.bad canvas').each ->
            ctx = @getContext '2d'
            parent = $(@).parent()
            parent.css 'position', 'relative'
            width = parent.width() + 10
            $(@).width width
            @width = width
            @height = 5
            ctx.strokeStyle = 'red'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo 0, 5
            ctx.bezierCurveTo 0, 2, width * 3 / 2, 0, width, 0
            ctx.stroke()
        textareaInput.find('.good canvas').each ->
            ctx = @getContext '2d'
            parent = $(@).parent()
            parent.css 'position', 'relative'
            width = parent.width() + 10
            $(@).width width
            @width = width
            @height = 5
            ctx.strokeStyle = 'green'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo 0, 5
            ctx.bezierCurveTo 0, 2, width * 3 / 2, 0, width, 0
            ctx.stroke()




    # Настройка обработчиков событий
    # - Обработчики щелчка мышки для выбора маркера
    $('.rXI---markers a').click ->
        x = $ @
        cls = x.attr 'class'
        if $('#rXI---main').hasClass cls
            $('#rXI---main').removeClass 'rXI---1Marker rXI---2Marker'
            whichMarker = null
        else
            $('#rXI---main')
                .removeClass('rXI---1Marker rXI---2Marker')
                .addClass(cls)
            whichMarker = cls
        window.getSelection().removeAllRanges()

    # - Обработчики выделения текста мышкой
    textareaInput.on 'dragstart', -> false
    textareaInput.on 'mouseup', processSelection

    # - Обработчик нажатия клавиш клавиатуры
    textareaInput.keyup changeAnswer

    # Заполнение полей цитаты и автора
    textareaInput.html markupWordsAndBlanks q.te
    authorElem.html q.au

    # Настройка окружения на тестирование или показ результатов
    if not slugInput.attr 'value'
        changeAnswer()
    else
        $('.rXI---markers').hide()
        textareaInput.attr 'contenteditable', false
        textareaInput.html getTextWithAnswers()
        adjustCanvas()

    ### {% if HTML %} ###
    authorElem.dblclick ->
        slugInput.toggleClass 'correct'
        if slugInput.hasClass 'correct'
            $('.rXI---markers').hide()
            textareaInput.attr 'contenteditable', false
            textareaInput.html getTextWithAnswers()
            adjustCanvas()
        else
            $('.rXI---markers').show()
            textareaInput.attr 'contenteditable', true
            textareaInput.html q.te
            changeAnswer()
    ### {% endif %} ###
    undefined

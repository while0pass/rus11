do ($=jQuery, q=rXI$h) ->
 whichMarker = null
 # - Обработчики щелчка мышки для выбора маркера
 $('.rXI---markers a').click ->
     x = $ @
     if $('#rXI---main').is('.answers') then return
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

 sentences = $('.rXI---sentence')
 for i in [0...sentences.length]
  do ($, q=q[i], root=sentences[i]) ->

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
    root = $ root
    textareaInput = root.find('.rXI---textarea')
    slugInput = root.find('.rXI---slug').find 'input[type="text"]'
    scoreInput = root.find('.rXI---score').find 'input[type="text"]'
    authorElem = root.find('.rXI---author')
    slugSeparator = '|'

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

    updateSelectionQuizResults = ->
        el = $(textareaInput)
        ranges = {}

        $('.rXI---markers a').each ->
            ranges[$(@).attr 'class'] = []

        for word in el.find('.rXI---word')
            x = $ word
            currentSeId = x.attr 'data-seId'
            currentMarker = currentSeId?.replace /[0-9]+$/, ''
            order = x.attr 'data-order'

            if not start and currentSeId
                start = order
                end = null
                seId = currentSeId
            else if start and currentSeId
                if seId isnt currentSeId
                    end = '' + (parseInt(order) - 1)
                    ranges[seId.replace /[0-9]+$/, ''].push(start + '-' + end)
                    start = order
                    end = null
                    seId = currentSeId
            else if start and not currentSeId
                end = '' + (parseInt(order) - 1)
                ranges[seId.replace /[0-9]+$/, ''].push(start + '-' + end)
                start = null
                end = null
                seId = null

        if start
            end = order
            ranges[seId.replace /[0-9]+$/, ''].push(start + '-' + end)

        for own key, value of ranges
            if value.length is 0
                value.push('0-0')  # NOTE: Особый нулевой диапазон. Означает,
                                   # что ни один диапазон слов данным маркером
                                   # не выделен.

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

    processSelection = (whichMarker, start, end) ->
        sel = document.getSelection()
        start = start or $(sel.anchorNode).closest '.rXI---word, .rXI---nonWord'
        end = end or $(sel.focusNode).closest '.rXI---word, .rXI---nonWord'

        if whichMarker
            if sel.isCollapsed
                seId = start.attr 'data-seId'
                if seId
                    textareaInput.find("[data-seId='#{ seId }']")
                        .removeClass(seId.replace /[0-9]+$/, '')
                        .removeAttr 'data-seId'
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
                    return false

            if not isStartWord
                traverseOp = if direction is 'right' then 'next' else 'prev'
                start = start[traverseOp]('.rXI---word')
                startOrder = parseInt start.attr 'data-order'
                isStartWord = true
            if not isEndWord
                traverseOp = if direction is 'right' then 'prev' else 'next'
                end = end[traverseOp]('.rXI---word')
                endOrder = parseInt end.attr 'data-order'
                isEndWord = true

            if direction is 'left'
                [start, end] = [end, start]
                [startOrder, endOrder] = [endOrder, startOrder]

            seId = whichMarker + processSelection.counter
            startToEndFilter = (startOrder, endOrder) ->
                ->
                    item = $ @
                    order = parseInt item.attr 'data-order'
                    if item.is('.rXI---word')
                        startOrder <= order <= endOrder
                    else
                        startOrder < order <= endOrder
            erase = ->
                $(@).removeClass('rXI---1Marker rXI---2Marker')
                    .removeAttr('data-seId')
            highlight = ->
                erase.call(@)
                $(@).addClass(whichMarker).attr 'data-seId', seId
            marker = (seId) -> seId.match(/(.*?)\d+$/)[1]

            for x in textareaInput.find('.rXI---nonWord, .rXI---word')
                        .filter(startToEndFilter(startOrder, endOrder))
                x = $ x
                oldSeId = x.attr 'data-seId'
                if oldSeId
                    y = textareaInput.find("[data-seId='#{ oldSeId }']")
                    if marker(oldSeId) is whichMarker
                        y.each highlight
                    else
                        y.each erase
                highlight.call(x)

            processSelection.counter++

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

    showPunctuationAnswers = ->
        pu = slugInput.attr('value').split slugSeparator
        puNumbers = getPuNumbers pu
        for i in [0...puNumbers.length]
            x = textareaInput.find(".rXI---nonWord[data-order='#{ i+1 }']")
            x.html(pu[i])
            if puNumbers[i] isnt q.pu[i]
                x.append('<canvas class="bad puCorrectness"/>')
            else if q.ma[i]
                x.append('<canvas class="good puCorrectness"/>')

    showSelectionAnswers = ->
        selections = root.find('.rXI---selection')
        rightSelections = q.se
        for i in [0...selections.length]
            x = $ selections[i]
            ranges = x.find('input').first().attr('value').split ','
            rightRanges = rightSelections[i].split ','
            for r in ranges
                if r is '0-0' then continue # NOTE: Пустой диапазон. Ничего
                                            # данным маркером не выделено.
                [start, end] = r.split '-'
                start = textareaInput.find(".rXI---word[data-order='#{start}']")
                end = textareaInput.find(".rXI---word[data-order='#{end}']")
                processSelection x.attr('data-marker'), start, end
                if rightRanges.indexOf(r) > -1
                    start.append('<canvas class="good seCorrectness"/>')
                else
                    start.append('<canvas class="bad seCorrectness"/>')


    adjustCanvas = ->
        textareaInput.find('canvas.bad.puCorrectness').each ->
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
        textareaInput.find('canvas.good.puCorrectness').each ->
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
        textareaInput.find('canvas.bad.seCorrectness').each ->
            ctx = @getContext '2d'
            parent = $(@).parent()
            parent.css 'position', 'relative'
            width = 10
            $(@).width width
            @width = width
            @height = 10
            ctx.strokeStyle = 'red'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo 2, 8
            ctx.bezierCurveTo 2, 5, 6, 4, 8, 2
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo 3, 2
            ctx.bezierCurveTo 7, 7, 6, 4, 8, 8
            ctx.stroke()
        textareaInput.find('canvas.good.seCorrectness').each ->
            ctx = @getContext '2d'
            parent = $(@).parent()
            parent.css 'position', 'relative'
            width = 10
            $(@).width width
            @width = width
            @height = 10
            ctx.strokeStyle = 'green'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo 2, 5
            ctx.bezierCurveTo 2, 5, 2, 6, 5, 8
            ctx.bezierCurveTo 6, 7, 6, 4, 8, 2
            ctx.stroke()




    # Настройка обработчиков событий
    # - Обработчики выделения текста мышкой
    textareaInput.on 'dragstart', -> false
    textareaInput.on 'mouseup', ->
        processSelection whichMarker
        updateSelectionQuizResults()

    # - Обработчик нажатия клавиш клавиатуры
    textareaInput.keyup changeAnswer

    # Заполнение полей цитаты и автора
    textareaInput.html markupWordsAndBlanks q.te
    authorElem.html q.au

    # Настройка окружения на тестирование или показ результатов
    if not slugInput.attr 'value'
        changeAnswer()
        updateSelectionQuizResults()
    else
        $('#rXI---main').addClass('answers')
        textareaInput.html markupWordsAndBlanks q.te
        textareaInput.attr 'contenteditable', false
        showPunctuationAnswers()
        showSelectionAnswers()
        adjustCanvas()

    ### {% if HTML %} ###
    authorElem.dblclick ->
        slugInput.toggleClass 'correct'
        if slugInput.hasClass 'correct'
            $('#rXI---main').addClass('answers')
            $('#rXI---main').removeClass 'rXI---1Marker rXI---2Marker'
            whichMarker = null
            textareaInput.html markupWordsAndBlanks q.te
            textareaInput.attr 'contenteditable', false
            showPunctuationAnswers()
            showSelectionAnswers()
            adjustCanvas()
        else
            $('#rXI---main').removeClass('answers')
            textareaInput.html markupWordsAndBlanks q.te
            textareaInput.attr 'contenteditable', true
            changeAnswer()
            updateSelectionQuizResults()
    ### {% endif %} ###
    undefined

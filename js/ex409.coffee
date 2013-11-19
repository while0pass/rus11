do ($=jQuery) ->
    updateWidth = ->
        x = $ @
        y = x.siblings('.widthGauge')
        y = x.parent().siblings('.widthGauge') unless y.get(0)
        if x.val()
            x.attr('value', x.val())
        else
            x.removeAttr('value')
        text = x.val() or x.attr('placeholder')
        y.html(text)
        x.css('width', y.innerWidth())
        x.closest('.rXI---input').css('width', y.innerWidth())
        x.closest('.subquestion').css('width', y.innerWidth())

    for i in $('.rXI---input')
        i = $ i
        placeholder = i.attr('data-placeholder')
        i.append('<span class="widthGauge"/>')
        i = i.find('input')
        i.attr('placeholder', placeholder)
        i.removeAttr('size')
        updateWidth.call(i.get(0))
        i.on 'keyup', updateWidth

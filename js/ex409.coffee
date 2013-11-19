do ($=jQuery) ->
    updateWidth = ->
        x = $ @
        y = x.siblings '.widthGauge'
        y = x.parent().siblings '.widthGauge' unless y.get(0)
        if x.val()
            x.attr 'value', x.val()
        else
            x.removeAttr 'value'
        text = x.val() or x.attr 'data-placeholder'
        y.html text
        x.css 'width', y.innerWidth()
        x.closest('.rXI---input').css 'width', y.innerWidth()
        x.closest('.subquestion').css 'width', y.innerWidth()

    for i in $ '.rXI---input'
        i = $ i
        placeholder = i.attr 'data-placeholder'
        i.append '<span class="widthGauge"/>'
        i = i.find 'input'
        i.attr 'data-placeholder', placeholder
        i.attr 'value', placeholder
        i.addClass 'rXI---placeheld'
        i.removeAttr 'size'
        updateWidth.call i.get 0
        i.on 'keyup', updateWidth
        if placeholder is '...'
            console.log '...'
            i.on 'focus', (event) ->
                x = $ @
                x.removeClass 'rXI---placeheld'
                x.attr 'value', '' if x.attr('value') is '...'
            i.on 'blur', (event) ->
                x = $ @
                if not x.val()
                    x.addClass 'rXI---placeheld'
                    x.attr 'value', '...'
        else
            i.on 'focus', (event) -> $(@).removeClass 'rXI---placeheld'
            i.on 'blur', (event) ->
                x = $ @
                if x.attr('data-placeholder') is x.attr('value')
                    x.addClass 'rXI---placeheld'

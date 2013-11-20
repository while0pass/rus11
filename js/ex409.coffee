do ($=jQuery) ->
    updateWidth = ->
        x = $ @
        y = x.siblings '.widthGauge'
        y = x.parent().siblings '.widthGauge' unless y.get(0)
        text = x.prop('value') or x.data 'placeholder'
        y.html text
        x.css 'width', y.innerWidth()
        x.closest('.rXI---input').css 'width', y.innerWidth()
        x.closest('.subquestion').css 'width', y.innerWidth()

    for i in $ '.rXI---input'
        i = $ i
        placeholder = i.data 'placeholder'
        i.append '<span class="widthGauge"/>'
        i = i.find 'input'
        i.data 'placeholder', placeholder
        i.prop 'value', placeholder
        i.addClass 'rXI---placeheld'
        i.removeAttr 'size'
        updateWidth.call i.get 0
        i.on 'keyup', updateWidth
        if placeholder is '...'
            i.on 'focus', (event) ->
                x = $ @
                x.removeClass 'rXI---placeheld'
                x.prop 'value', '' if x.prop('value') is '...'
            i.on 'blur', (event) ->
                x = $ @
                if not x.prop('value')
                    x.addClass 'rXI---placeheld'
                    x.prop 'value', '...'
        else
            i.on 'focus', (event) -> $(@).removeClass 'rXI---placeheld'
            i.on 'blur', (event) ->
                x = $ @
                if x.data('placeholder') is x.prop('value')
                    x.addClass 'rXI---placeheld'
                if not x.prop('value')
                    x.addClass 'rXI---placeheld'
                    x.prop('value', x.data 'placeholder')


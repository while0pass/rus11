do ($=jQuery) ->

    updateFormWidget = ->
        x = $ @
        y = x.siblings '.widthGauge'
        y = x.parent().siblings '.widthGauge' unless y.get(0)

        if not x.prop('value') and x.data('placeholder') isnt '...'
            x.prop('value', x.data 'placeholder')
        text = x.prop('value') or '...'  # NOTE: Дефолтное значение '...'
            # выбрано не случайно. Если поле не заполнено, у него выставится
            # такая ширина, как если бы там стоял стандартный текст-заменитель.
        y.html text

        width = y.innerWidth()
        x.css 'width', width
        x.closest('.rXI---input').css 'width', width
        x.closest('.subquestion').css 'width', width


    for i in $ '.rXI---input'
        i = $ i
        placeholder = i.data 'placeholder'
        i.append '<span class="widthGauge"/>'
        i = i.find 'input'
        i.data 'placeholder', placeholder
        if not i.prop('value')
            i.prop 'value', placeholder
            i.addClass 'rXI---placeheld'
        i.removeAttr 'size'
        updateFormWidget.call i.get 0
        i.on 'keyup', updateFormWidget
        if placeholder is '...'
            i.on 'focus', (event) ->
                x = $ @
                x.removeClass 'rXI---placeheld'
                if x.prop('value') is '...'
                    x.prop 'value', ''
            i.on 'blur', (event) ->
                x = $ @
                if not x.prop('value')
                    x.addClass 'rXI---placeheld'
                    x.prop 'value', '...'
                    updateFormWidget.call @
        else
            i.on 'focus', (event) -> $(@).removeClass 'rXI---placeheld'
            i.on 'blur', (event) ->
                x = $ @
                if x.data('placeholder') is x.prop('value')
                    x.addClass 'rXI---placeheld'
                if not x.prop('value')
                    x.addClass 'rXI---placeheld'
                    x.prop('value', x.data 'placeholder')
                    updateFormWidget.call @

<div id="rXI---textarea" contenteditable="true"></div>
<div id="rXI---author"></div>

<div id="rXI---slug">
    {% if HTML %}
        <input type="text" />
    {% else %}
        {0:SA:%100%{{ RIGHT_SLUG }}}
    {% endif %}
</div>
<div id="rXI---score">
    {% if HTML %}
        <input type="text" />
    {% else %}
        {10:SA:%10%1~%20%2~%30%3~%40%4~%50%5~%60%6~%70%7~%80%8~%90%9~%100%10}
    {% endif %}
</div>

<script type="application/javascript">
    var rXI$h = {
            au: '{{ AUTHOR }}',
            te: '{{ TEXT }}',
            pu: {{ PUNCTUATION_MAP }},
            ma: {{ ANSWERS_MASK }},
        };
</script>
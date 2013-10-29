
<div class="rXI---markers">
    <a class="rXI---blueMarker">
        <img src="../../img/blueMarkerPointer.png" alt=""/>
        Одиночные деепричастия
    </a>
    <a class="rXI---greenMarker">
        <img src="../../img/greenMarkerPointer.png" alt=""/>
        Деепричастные обороты
    </a>
</div>

<div id="rXI---textarea" contenteditable="true"></div>
<div id="rXI---author"></div>

{% for SELECTION in SELECT %}
<div id="rXI---selection{{ loop.index }}" class="rXI---selection">
    {% if HTML %}
        <input type="text" />
    {% else %}
        {0:SA:%100%{{ SELECTION }}}
    {% endif %}
</div>
{% endfor %}

<div id="rXI---slug">
    {% if HTML %}
        <input type="text" />
    {% else %}
        {0:SA:%100%{{ SLUG }}}
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
            pu: {{ PUNCT }},
            ma: {{ MASK }},
        };
</script>

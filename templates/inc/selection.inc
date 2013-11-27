
<div class="rXI---markers">
{% for MARKER in MARKERS %}
    <a class="rXI---{{ loop.index }}Marker"><span></span>
        {{ MARKER }}
    </a>
{% endfor %}
</div>

<script type="application/javascript"> var rXI$h = []; </script>

<div class="rXI---allSentences">
{% for item in DATASET %}
<div class="rXI---sentence">
    <div class="rXI---textarea" contenteditable="true"></div>
    <div class="rXI---author"></div>

    {% for SELECTION in item.SELECT %}
    <div data-marker="rXI---{{ loop.index }}Marker" class="rXI---selection">
        {% if HTML %}
            <input type="text" />
            <input type="text" />
        {% else %}
            {0:SA:%100%{{ SELECTION }}}
            {2:SA:%10%1~%20%2~%30%3~%40%4~%50%5~%60%6~%70%7~%80%8~%90%9~%100%10}
        {% endif %}
    </div>
    {% endfor %}

    <div class="rXI---slug">
        {% if HTML %}
            <input type="text" />
        {% else %}
            {0:SA:%100%{{ item.SLUG }}}
        {% endif %}
    </div>
    <div class="rXI---score">
        {% if HTML %}
            <input type="text" />
        {% else %}
            {10:SA:%10%1~%20%2~%30%3~%40%4~%50%5~%60%6~%70%7~%80%8~%90%9~%100%10}
        {% endif %}
    </div>

    <script type="application/javascript">
        rXI$h.push({
                au: '{{ item.AUTHOR }}',
                te: '{{ item.TEXT }}',
                pu: {{ item.PUNCT }},
                ma: {{ item.MASK }},
                se: [ {% for S in item.SELECT %} '{{ S }}', {% endfor %} ],
            });
    </script>
</div>
{% endfor %}
</div>

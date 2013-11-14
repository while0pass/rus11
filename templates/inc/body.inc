{% include 'jquery.inc' %}

<script type="application/javascript">
    document.write('<style>{% include CSS %}</style>');
</script>

<div id="rXI---main" lang="ru">

    {% include QUIZ %}

</div>

<script type="application/javascript">

    {% include JS %}

    {% if not HTML %}
    jQuery.noConflict(true);
    {% endif %}

</script>

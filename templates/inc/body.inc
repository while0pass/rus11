<script id="rus11hStyles" type="text/css">

    {% include CSS %}

</script>

{% include 'jquery.inc' %}

<script>
    var txt = $('#rus11hStyles').text();
    document.write('<style>' + txt + '</style>');
</script>

<div id="rus11h">

    {% include QUIZ %}

</div>

<script type="application/javascript">

    {% for prefix in JS %}
        {% set JSFILE = 'ex' + EXERCISE + '.' + prefix +'.js' %}
        {% include JSFILE %}
    {% endfor %}

</script>

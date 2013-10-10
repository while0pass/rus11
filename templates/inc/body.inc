<script id="rXI---styles" type="text/css">

    {% include CSS %}

</script>

{% include 'jquery.inc' %}

<script>
    var txt = $('#rXI---styles').text();
    document.write('<style>' + txt + '</style>');
</script>

<div id="rXI---main">

    {% include QUIZ %}

</div>

<script type="application/javascript">

    {% include JS %}

</script>


{% set AUTHOR = 'К. Г. Паустовский' %}

{% set TEXT =              'Вокруг нашего дома стояли задумавшись огромные каштаны.' %}
{% set PUNCTUATION_MAP = '[0,     0,     0,   0,     1,          1,       0,      8]' %}
{% set ANSWERS_MASK =    '[0,     0,     0,   0,     1,          1,       0,      0]' %}
{% set RIGHT_SLUG =       '| | | |, |, | |.' %}

{% include 'punctuation.inc' %}

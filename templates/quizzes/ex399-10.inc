
{% set AUTHOR = 'М. Горький' %}

{% set TEXT =              'Самовар уже стоял на столе шипя и курлыкая.' %}
{% set PUNCTUATION_MAP = '[0,      0,  0,    0, 0,    1,   0,0,       8]' %}
{% set ANSWERS_MASK =    '[0,      0,  0,    0, 0,    1,   0,0,       0]' %}
{% set RIGHT_SLUG =       '| | | | |, | | |.' %}

{% include 'inc/punctuation.inc' %}

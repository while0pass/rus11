
{% set AUTHOR = 'А. С. Пушкин' %}

{% set TEXT =              'Улыбкой ясною природа сквозь сон встречает утро года; синея блещут небеса.' %}
{% set PUNCTUATION_MAP = '[0,      0,    0,      0,     0,  0,        0,   0,   2,     1,      0,     8]' %}
{% set ANSWERS_MASK =    '[0,      0,    0,      0,     0,  0,        0,   0,   0,     1,      0,     0]' %}
{% set RIGHT_SLUG = '| | | | | | | |; |, | |.' %}

{% include 'inc/punctuation.inc' %}


{% set AUTHOR = 'И. С. Тургенев' %}

{% set TEXT =              'Пастух шел напевая за стадом жадных и пугливых овец.' %}
{% set PUNCTUATION_MAP = '[0,     0,  1,      1, 0,     0,     0,0,       0,   8]' %}
{% set ANSWERS_MASK =    '[0,     0,  1,      1, 0,     0,     0,0,       0,   0]' %}
{% set RIGHT_SLUG =  '| | | | | | | | |.' %}

{% include 'punctuation.inc' %}

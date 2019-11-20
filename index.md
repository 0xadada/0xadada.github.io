---
layout: list
title: "0xADADA"
displayTitle: " "
metaDescription: Software engineer, open web enthusiast, essayist, privacy and encryption advocate. Idealist. Recovering techno-utopian.
metaOgType: "website"
---

<ol class="c-Index">
{% for post in site.posts %}
  {% if post.hidden != true %}
    <li class="c-Index--Item">
      <a href="{{ post.url }}" title="{{ post.title }}">
        {{ post.title }}
      </a>
      <br>

      {% if post.metaDescription %}
        <span>{{ post.metaDescription }}</span>
        <br>
      {% endif %}

      <time class="published" datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date: "%A %B %-d, %Y" }}</time>
    </li>
  {% endif %}
{% endfor %}
</ol>

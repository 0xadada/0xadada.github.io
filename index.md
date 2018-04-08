---
layout: page
title: "0xADADA"
displayTitle: Writing
metaDescription: "Writing of 0xADADA"
metaOgType: "website"
---

<ol class="c-Index">
{% for post in site.posts %}
  {% if post.hidden != true %}
  <li class="c-Index--Item">
    <a href="{{ post.url }}" title="{{ post.title }}">
      <span>{{ post.title }}</span>
    </a>
    <br>
    {% if post.metaDescription %}
    <span>{{ post.metaDescription }}</span>
    {% endif %}
    <br>
    <time class="published" datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date: "%A %B %-d, %Y" }}</time>
  </li>
  {% endif %}
{% endfor %}

</ol>

{% for tag in site.tags %}
  {{ tag.name }} - {{ tag.slug }}
{% endfor %}

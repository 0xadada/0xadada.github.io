---
title: "0xADADA"
displayTitle: "0xADADA"
metaDescription: "The place where 0xADADA vomits ideas onto the world"
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

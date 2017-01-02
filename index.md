---
layout: page
title: "0xADADA"
displayTitle: Writing
metaDescription: "Writing of 0xADADA"
metaOgType: "website"
---

<ol>
{% for post in site.posts %}
  {% if post.hidden != true %}
  <li>
    <a href="{{ post.url }}" title="{{ post.title }}">
      <span>{{ post.title }}</span>
    </a>
    <br>
    {% if post.metaDescription %}
    <span>{{ post.metaDescription }}</span>
    {% endif %}
    <br>
    <time datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date: "%A %B %-d, %Y" }}</time>
  </li>
  {% endif %}
{% endfor %}
</ol>

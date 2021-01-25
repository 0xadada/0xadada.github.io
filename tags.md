---
title: "Tags - 0xADADA"
navTitle: Topics…
inNav: true
navOrder: 2
displayTitle: Topics
metaDescription: "Topics - 0xADADA"
metaOgType: "article"
metaImage: /static/images/meta/apple-touch-icon.png
---


{% capture site_tags %}{% for tag in site.tags %}{{ tag | first | downcase }}#{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tag_hashes = site_tags | split:',' | sort %}
<ul>
{% for hash in tag_hashes %}
  {% assign keyValue = hash | split: '#' %}
  {% capture tag_word %}{{ keyValue[1] | strip_newlines }}{% endcapture %}
  <li>
    <a href="/{{ tag_word }}">
      <a href="/{{ tag_word }}" title="{{ tag_word }}">{{ tag_word }}</a>
    </a>
  </li>
{% endfor %}
</ul>

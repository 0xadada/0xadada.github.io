---
title: Bike of Theseus
displayTitle: Bike of Theseus
metaDescription: Build specifications for a Royal H Cycles fixed gear track bike
metaKeywords: bicycle, bike, custom track bike, track bikes, fixed gear, fixie
metaOgType: article
metaImage: /static/images/2015-08-15-raspec-impreza-exterior-front-left-01-far.jpg
date: 2019-09-18 21:11:00
author: "0xADADA"
license: cc-by-nc-sa
tags: [projects]
galleries: 
  first:
    - src: /static/images/2019-09-18-01-1-before-rebuild.jpg
      alt: Fuji Track, before the rebuild
    - src: /static/images/2019-09-18-02-2-fork-lug.jpg
      alt: Fork lug, the inspiration for the project
    - src: /static/images/2019-09-18-03-3-design.png 
      alt: The CAD design
---

## About the Bike

[Bike of Theseus](https://en.wikipedia.org/wiki/Ship_of_Theseus)

<style>
.gallery {
  list-style: none;
  padding: 0;
  margin: 0;
}


.gallery-option,
.gallery-image {
  display: none;
}

.gallery-option:checked + .gallery-image {
  display: block;
}

li.thumbnails {}
ol.thumbnails {}
</style>

<ol class="gallery">
{% for image in page.galleries["first"] %}
  <li class="gallery-item">
    <input id="{{ image.alt | slugify }}" type="radio" name="gallery" class="gallery-option" checked aria-labelledby="label-A">
    <img id="image-{{ image.alt | slugify}}" class="gallery-image" src="{{ image.src }}" alt="{{ image.alt }}">
  </li>
{% endfor %}
  <li class="thumbnails">
    <ol class="thumbnails gallery">
    {% for image in page.galleries["first"] %}
      <li>
        <label for="{{ image.alt | slugify}}">
          <img src="{{ image.src }}" alt="{{ image.alt }}" width="24" aria-label="Select {{ image.alt }}">
        </label>
      </li>
    {% endfor %}
    </ol>
  </li>
</ol>

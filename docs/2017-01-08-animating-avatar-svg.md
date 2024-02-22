---
title: "Animating SVG with CSS"
description: "How to use SVG and CSS to create dynamic imagery."
image: /static/images/meta/apple-touch-icon.png
tags: [projects, graphics, vector, animation, css]
---

I finally got around to converting my avatar from a raster graphic to a vector
format. I wanted to be able to animate the polygons using JavaScript and CSS.
Another great advantage of a vector format is how the format lends itself to
generate a PNG or JPG in any size.

## Massaging the SVG File Format

First things first, I took the source image and ran it through the
[delaunay triangulation - image triangulation experiment](https://snorpey.github.io/triangulation/)
software, experimenting with various values for blur, accuracy and point count.
The output of this software was a `512Kb` SVG file.

Next I opened the file in [Inkscape](https://inkscape.org/en/), a SVG vector
graphics editor to remove the polygons in the background, cleanup some awkward
polys and make a few minor adjustments. Inkscape adds a bunch of metadata and
additional properties to the raw SVG that can be cleaned up.

Once I was happy with the results of my tweaking in Inkscape, I saved the SVG
and opened it in [SVGOMG](https://jakearchibald.github.io/svgomg/) a web-based
SVG optimization GUI for the [SVGO](https://github.com/svg/svgo) suite of tools.
This tool will output a much smaller SVG file that is ready for either editing
or delivery over HTTP. In this case, the file was reduced to `312Kb` a 40%
reduction in file size, primarily by transforming point-based `<polygon>`
elements to the more concise to `<path>` element.

## Animation

With the SVG file ready, I moved on to the action animation work.

The animation would be a series of CSS keyframes that would simply toggle the
opacity level to produce a flickering affect. The artwork begins with all
opacity set to `0` (transparent), and each keyframe incrementally toggles
opacity until the last frame finally sets it to `1`.

```css
.p {
  /* each polygon "path" starts fully transparent */
  opacity: 0;
}

/* a set of keyframes that incrementally toggle opacity, this */
/* keyframes set is called "slide-into-place" */
@keyframes slide-into-place {
  0% {
    opacity: 1;
  }
  5% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  17% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  55% {
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  75% {
    opacity: 0.25;
  }
  85% {
    opacity: 0.85;
  }
  90% {
    opacity: 0;
  }
  95% {
    opacity: 0.25;
  }
  100% {
    opacity: 1;
  }
}
```

Every `<path>` in the SVG document is given a classname `p` (for path), I then
use javascript to get references to these paths, and simply add a new classname
`is-animated` to their `class` attribute. This classname will be used to attach
the keyframes to the SVG paths.

```css
.p.is-animated {
  /* sets the keyframes to use for animation */
  animation-name: slide-into-place;
  /* pause before animation starts */
  animation-delay: 1s;
  animation-timing-function: ease;
  animation-direction: normal;
  /* Run the animation only once */
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
```

To attach the keyframe animation to the SVG `<path>`, the only think necessary
is to add the `is-animated` classname to the element. We do this on `Line-A`.
This is done inside a loop that iterates over all the `<path>` elements.

If I just add the `is-animated` class to the element, all polygons will flicker
at the same time, looking like the entire image is flickering- which isn't what
I want. To address this, I need to randomize the start-time of when each polygon
begins flickering. This makes each polygon flicker on its own timeline. I get a
random number on `Line-B` and use that as a delay to begin the flickering.

`path.style.animationDelay` (on `Line-C`) is used to wait for a randomized
timeout (`Line-B`) period before animation starts.

```javascript
function init() {
  var paths = document.querySelectorAll("path"),
    i = 0,
    randTimeout = null;
  path = null;
  for (i = 0; i < paths.length; i++) {
    let path = paths[i];
    randTimeout = Math.floor(Math.random() * (1500 - 1) + 1); // Line-B
    path.style.animationDelay = randTimeout + "ms"; // Line-C
    path.classList.add("is-animated"); // Line-A
  }
}
```

The above `init()` function is called once the SVG document has finished
loading.

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewbox="0 0 660 660"
  onload="init()"
></svg>
```

## Result

<object type="image/svg+xml" data="/static/images/meta/avatar-animated.svg"
  height="660" width="660"> </object> _(Reload the page to view the animation
again)_

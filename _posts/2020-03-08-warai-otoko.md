---
title: "Warai Otoko Logo"
displayTitle: "Warai Otoko Logo"
date: 2020-03-08 16:48:00
metaDescription: "Animated SVG logo using CSS transforms"
metaKeywords: svg, css, web development
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [projects, open-source]
---

An animated SVG using CSS transforms to rotate the text.

<svg viewBox="-160 -160 360 320" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <style>
  <![CDATA[
    .spin {
      animation:spin 15s linear infinite;
      animation-direction: reverse;
    }
    @keyframes spin {
      100% {
        transform:rotate(360deg);
      }
    }
  ]]>
  </style>

  <path id="f" d="m123,0a123,123 0,0 1-246,0a123,123 0,0 1 246,0"/>

  <g fill="#057">
    <circle r="160"/>
    <circle r="150" fill="#fff"/>
    <text class="spin" font-size="28" font-stretch="condensed" font-family="Impact">
      <textPath xlink:href="#f">I thought what I'd do was, I'd pretend I was one of those deaf-mutes</textPath>
    </text>
    <circle r="115"/>
    <circle r="95" fill="#fff"/>
    <path d="m-8-119h16 l2,5h-20z"/>
    <circle cx="160" cy="0" r="40"/>
    <path d="m-95-20v-20h255a40,40 0,0 1 0,80h-55v-20z"/>
    <path d="m-85 0a85,85 0,0 0 170,0h-20a65,65 0,0 1-130,0z"/>
    <path d="m-65 20v20h140v-20z"/>
    <path d="m-115-20v10h25v30h250a20,20 0,0 0 0,-40z" fill="#fff"/>
    <path d="m-20 10c-17-14-27-14-44 0 6-25 37-25 44 0z"/>
    <path d="m60 10c-17-14-27-14-44 0 6-25 37-25 44 0z"/>
  </g>
</svg>

The Laughing Man
<ruby>
  <ruby>
    笑<rp>(</rp><rt>わらい</rt><rp>)</rp>
    い
    男<rp>(</rp><rt>おとこ</rt><rp>)</rp>
  </ruby>
  <rp>(</rp><rt>warai otoko</rt><rp>)</rp>
</ruby>
is a fictional character in the anime series _Ghost in the Shell: Stand
Alone Complex_. The Laughing Man logo is an
animated image of a smiling figure wearing a cap, with circling text quoting a 
line from Salinger's novel _The Catcher in the Rye_, which reads:

> "I thought what I'd do was, I'd pretend I was one of those deaf-mutes."

Code is up [on github](https://github.com/0xadada/warai-otoko)

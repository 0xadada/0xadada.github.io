---
title: "random-emoji v1.0.0"
displayTitle: "@0xadada/random-emoji v1.0.0"
date: 2019-10-06 11:13:00
metaDescription: "random emoji function with zero dependencies"
metaKeywords: javascript, web development, npm package
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [projects, open-source]
---

Released a tiny npm package today:
[@0xadada/random-emoji](https://0xadada.pub/random-emoji/), a javascript random
emoji function with zero dependencies.

```javascript
$ yarn add @0xadada/random-emoji
$ node
> const random = require('@0xadada/random-emoji');
> random()
'😁'
let a = random();  // defaults to 'emoticons'
let b = random('emoticons');
let c = random('food');
let d = random('animals');
let e = random('expressions');
console.log(a, b, c, d, e);
// 😍 🙄 🍗 🐥 🤢
```

Small, fun.

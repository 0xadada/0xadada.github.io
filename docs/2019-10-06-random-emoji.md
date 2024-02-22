---
title: "@0xadada/random-emoji v1.0.0"
description: "A random emoji function with zero dependencies."
tags: [projects, open-source, javascript, web development, npm]
---

Released a tiny npm package today:
[@0xadada/random-emoji](https://0xadada.github.io/random-emoji/), a javascript random
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

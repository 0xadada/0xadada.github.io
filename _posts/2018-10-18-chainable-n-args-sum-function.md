---
title: "An Interview Question: Write a chainable n-argument sum function"
date: 2018-10-18 11:13:00
metaDescription:
  "Writing a javascript function to sum multiple inputs with chainable
  invocation"
metaKeywords: javascript
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [projects, open-source]
---

I came across an interesting interview question, along the lines of

> "How would you make this work?"

```javascript
add(2, 5);
> 7
add(2)(5);
> 7
```

I thought this was a very interesting question, so took some time last night to
play with it.

Heres what I got:

A solution to the invocation one isn't tough, theres just the tricky bit to
coerce the `arguments` into an Array, and to handle the case when nothing is
passed in.

```javascript
let sum = function() {
  let args = Array.prototype.slice.call(arguments.length ? arguments : [0]);
  return args.reduce((acc, i) => (acc += i));
};
```

Now, to get chained invocation to work, I used `bind` to generate a new function
that would be returned to the caller, allowing for chained invocation. The
tricky bit is to set the `valueOf` function to return the sum, so when checked
for a value, the function returns a number. I also changed the way i convert
arguments into an array by using the spread `...` operator.

Thus:

```javascript
let sumChainable = function() {
  let sum = [0, ...arguments].reduce((acc, i) => (acc += i)); // see (a)
  let f = sumChainable.bind(null, sum); // see (b)
  f.valueOf = () => sum; // see (c)
  return f;
};
/* (a)
 * [0, ...arguments] will convert arguments to an Array
 * to allow the `reduce`. It will also create an initial item
 * `0` to handle the case no arguments are passed in. Thus
 * making `sumChainable()` possible.
 *
 * (b)
 * Generate a nested function that will be returned, and pass
 * the sum to it. This allows the return value of the function
 * to be invoked in a chain, each changed invocation passing
 * the sum of its caller. Thus `sumChainable()()` is possible.
 *
 * (c)
 * Setting the `valueOf()` function on the returned function to
 * return the sum allows the comparison operator `==` to check
 * the value of the function against a number. Thus making
 * `sumChainable() == 0` possible.
 */
```

added some sanity tests:

```javascript
/* some tests: */
console.log( `typeof sumChainable(1) == 'function'`, typeof sumChainable(1) == `function` ? 'passed' : 'failed' );
console.log( `sumChainable() == 0`, sumChainable() == 0 ? 'passed' : 'failed' );
console.log( `sumChainable(1) == 1`, sumChainable(1) == 1 ? 'passed' : 'failed' );
console.log( `sumChainable(1) !== 1`, sumChainable(1) !== 1 ? 'passed' : 'failed' );
console.log( `x = sumChainable(1), x.valueOf() === 1`, (x = sumChainable(1), x.valueOf() === 1) ? 'passed' : 'failed' );
console.log( `sumChainable(1,2) == 3`, sumChainable(1,2) == 3 ? 'passed' : 'failed' );
console.log( `sumChainable(1,2,3) == 6`, sumChainable(1,2,3) == 6 ? 'passed' : 'failed' );
console.log( `sumChainable()() == 0`, sumChainable()() == 0 ? 'passed' : 'failed' );
console.log( `sumChainable(0)(1)`, sumChainable(0)(1) == 1 ? 'passed' : 'failed' );
console.log( `sumChainable(1,2)(3)`, sumChainable(1,2)(3) == 6 ? 'passed' : 'failed' );
console.log( `sumChainable(1,2,3)(4)(5)`, sumChainable(1,2,3)(4)(5) == 15 ? 'passed' : 'failed' );
console.log( `sumChainable(1,2,3)(4,5)(6)`, sumChainable(1,2,3)(4,5)(6) == 21 ? 'passed' : 'failed' );
```

viola!

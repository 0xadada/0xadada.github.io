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
add(2, 5); // multiple arguments style
> 7
add(2)(5); // currying, a chained invocation style
> 7
add(1,2)(3,4) // both
> 10
```

I thought this was a very interesting question, so took some time to
implement a multi-argument / curried function.

Heres what I got:

A solution to the multiple argument style is straightforward, theres just the bit to
change `arguments` into an Array, and to handle the case when nothing is
passed in.

```javascript
let sum = function() {
  let args = arguments.length ? Array.from(arguments) : [0]; // convert arguments to array for .reduce
  return args.reduce((acc, i) => (acc += i));
};
```

Now, to get chained invocation style to work, I used `bind` to generate a new function
that would be returned to the caller, allowing for chained invocation. The
tricky bit is to set the `valueOf` function to return the sum, so when checked
for a value, the function returns a number.

Thus:

```javascript
let sum = function() {
  let args = arguments.length ? Array.from(arguments) : [0]; // see (a)
  let sum = args.reduce((acc, i) => (acc += i)); 
  let f = sum.bind(null, sum); // see (b)
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
 * Generate a nested arrow function that will be returned, and pass
 * the sum to it. This allows the return value of the function
 * to be invoked in a chain, each changed invocation passing
 * the sum of its caller. Thus `sumChainable()()` is possible.
 *
 * (c)
 * Setting the `valueOf()` function on the returned function to
 * return the sum allows the comparison operator `==` to check
 * the value of the function against a number. Thus making operations
 * like `sumChainable() == 0` and `sumChainable(1, 1) + 2 == 4` possible.
 */
```

We can clean up this code by using the `...` rest parameters.

```javascript
function sum(...args) {
  const value = args.reduce((acc, a) => acc + a, 0);
  const f = sum.bind(null, value);
  f.valueOf = () => value;
  return f;
}
```

added a function to run test conditions, and defined some tests:

```javascript
function test(conditions) {
  conditions.forEach(([msg, cFn], i) => {
    const result = cFn();
    console.log(`${i} ${result ? '✅' : '🚫'} ${msg}`);
    console.assert(cFn(), msg);
  });
  console.log(`${conditions.length} tests completed`);
}

let conditions = [
  ['sum() returns 0', () => sum() == 0],
  ['sum()() returns 0', () => sum()() == 0],
  ['typeof sum() returns "function"', () => typeof sum() == 'function'],
  ['typeof sum().valueOf() returns "number"', () => typeof sum().valueOf() == 'number'],
  ['sum(0) returns 0', () => sum(0) == 0],
  ['sum(0)(0) returns 0', () => sum(0)(0) == 0],
  ['sum()(1) returns 1', () => sum()(1) == 1],
  ['sum(1,2) returns 3', () => sum(1,2) == 3],
  ['sum(1,2,3) returns 6', () => sum(1,2,3) == 6],
  ['sum(1,2,3)() returns 6', () => sum(1,2,3)() == 6],
  ['sum(1,2,3)(1) returns 7', () => sum(1,2,3)(1) == 7],
  ['sum(1,2,3)(1) returns 7', () => sum(1,2,3)(1) == 7],
  ['sum(1,2,3)(1,2) returns 9', () => sum(1,2,3)(1,2) == 9],
];

test(conditions); // run the tests
```

viola!

Future improvements would be to get strict equality `===` operator to recognize the result
as type `number` rather than type `function`, but Javascript doesn't have a way to override operations.
We can also change the API slightly by
invoking `.valueOf()` at the end of the invocation chain to yield a `number` primative value.

```javascript
// test for strict equality using .valueOf()
console.log( `sum(1,2,3)(4,5)(6).valueOf()`, sum(1,2,3)(4,5)(6).valueOf() === 21 ? 'passed' : 'failed' );
```


future would would be to get working:

```javascript
console.log( `typeof sumChainable(1) === 'number'`, typeof sumChainable(1) === `number` ? 'passed' : 'failed' );
```

---
title: "JavaScript The Good Parts"
description: Javascript The Good Parts notes.
tags: [notes, software-engineering, JavaScript]
---

_Notes from the book: JavaScript: The Good Parts by Douglas Crockford_

## Index

- [JavaScript: The Good Parts](#javascript-the-good-parts)
  - [Primitives](#primitives)
  - [Execution Flow](#execution-flow)
  - [Equality](#equality)
  - [Loops / Enumeration](#loops--enumeration)
  - [Object Literals](#object-literals)
  - [Arrays](#arrays)
  - [Delete](#delete)
  - [Global Abatement](#global-abatement)
  - [Reference](#reference)
  - [Reflection](#reflection)
  - [Functions](#functions)
  - [Prototype](#prototype)
  - [Function Invocation Pattern](#function-invocation-pattern)
  - [Constructor Invocation pattern](#constructor-invocation-pattern)
  - [Closure](#closure)
- [Modules](#modules)
- [WTF](#wtf)

## JavaScript: The Good Parts

A walkthrough many of the useful code examples from Douglas Crockfords' seminal
book,
[JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do).

### Primitives

JavaScript Reserved words:

```javascript
abstract
boolean break byte
case catch char class const continue
debugger default delete do double
else enum export extends
false final finally float for function
goto
if implements import in instanceof int interface
long
native new null
package private protected public
return
short static super switch synchronized
this throw throws transient true try typeof
var volatile void
while with
```

Simple types

```javascript
// Numbers: 1, 1.1, 1e10, 1e+10,
// Strings: "Hello", 'hello'
// Booleans: true, false
// null
// undefined
// Object
```

Built in values

```javascript
true;
false;
null;
undefined;
NaN;
Infinity;
```

JavaScript represents all numbers internally as a 64-bit floating point value
(like Java's `double`).

```javascript
// integer
1 === 1.0; // true

// fraction
(0.1 ===
  0.1(
    // true

    // exponent: value is calculated by multiplying the part before the
    // e by 10 raised to the power of the part after the e.
    1 * 10,
  ) *
    (1 * 10)) ===
  1e2; // true
1e2 === 100; // true

// Infinity represents all values greater than:
1.7976931348623157e103;
typeof Infinity === "number"; // true
```

Numbers, strings and booleans are object like in that they have methods, but
they are immutable.

Arrays, functions, regular expressions and objects are Objects. A simple object:

```javascript
// simple object literal
var an_object = {};
// simple object literal with 2 values (comma-separated)
var another_object = {
  my_value: 3.1,
  your_value: 3.2,
};
another_object.my_value == 3.1; // true

// attempts to access undefined properties will throw TypeError
another_object.fake.my_value; // Throws TypeError
// Prevent TypeError by testing that all attributes exist before accessing
(another_object.test && another_object.test.test) || "none"; // "none"
```

Objects are class-free, which is to say that there is no constraint on the names
of its properties or their values. The object doesn't need to be defined before
it is instantiated.

JavaScript has prototype linkage, meaning an object can inherit the properties
of another object. This can be used to reduce object initialization time, memory
consumption and increase code reuse.

### Execution Flow

Execution and flow statements.

```javascript
// Conditional statements: if and switch
// Looping statements: do, for, while
// Disruptive statements: break, continue, return, throw
```

Falsy values. When conditional expressions evaluate to these values, the
expression will result in `false`.

```javascript
false;
null;
undefined;
(""); // empty  string
0;
NaN;
```

Operators and statements of equality.

```javascript
// Operator precedence
. [] ()                   // Refinement and invocation
delete new typeof + - !   // Unary operators
* / %                     // Multiplication, division, remainder
+ -                       // Addition/concatenation, subtraction
>= <= > <                 // Inequality
=== !==                   // Equality
&&                        // Logical and
||                        // Logical or
? :                       // Ternary
```

NaN

```javascript
// NaN is a number value that is the result of an operation that
// cannot produce a normal result. It is not equal to anything else,
// including itself.
NaN == NaN; // false
NaN === NaN; // false

// Use isNaN to detect if a value is NaN
isNaN(NaN); // true
```

### Equality

Rule of thumb, the following expressions are all false using `===` or `!==` so
use these operators instead.

```javascript
"c" + "a" + "t" === "cat"; // true
"" == "0"; // false
0 == ""; // true, both are falsy
0 == "0"; // true
false == "false"; // false
false == "0"; // true
false == undefined; // false
false == null; // false
null == undefined; // true
```

### Loops / Enumeration

The `for in` statement can loop over all properties of an object, but will
include all object types (including functions) as well as all objects along the
prototype chain. The `for in` operator enumerates the property names on an
object.

```javascript
var animal_names = {
    'dog': 'Piper',
    'cat': 'Snookins',
    'goat': 'Mr J'
};
for( var animal in animal_names ) {
    console.log( animal, animal_names[animal] );
}
> dog Piper
> cat Snookins
> goat Mr J
```

It is important to know the names can be in any order and can be any type
including functions.

### Object literals

Object literal - pair of curly braces surrounding zero or more name: value
pairs.

```javascript
var empty_object = {};
var stooge = {
  first_name: "Jerome",
  last_name: "Howard",
  nickname: "Jer",
};
var jer1 = stooge["first_name"];
console.log(jer1); // "Jerome"
var jer2 = stooge.first_name;
console.log(jer2); // "Jerome"
var jer3 = stooge.favorite && stooge.favorite.color; // return undefined
console.log(jer3); // undefined
```

### Arrays

Arrays have a length property.

```javascript
var empty = [];
var numbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
empty.length > 0;
numbers.length > 10;
```

Objects have no length property

```javascript
var numbers_object = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};
numbers_object.length > undefined;

var myArray = [];
myArray.length > 0;
```

Arbitrary array indexes can be set, although there may not be items populating
the array before it.

```javascript
// myArray = [];
myArray[1001] = true; // create and set value of index 1001 to true
console.log(myArray.length); // 1002 OMG!!

var arrayItemCount = 0;
for (var item in myArray) {
  arrayItemCount += 1;
}
console.log("myArray counted items: " + arrayItemCount);
```

To delete from an array, use `Array.splice()`. This function takes 3 arguments,
`start` the index to start adding/removing items, `deleteCount` the number of
items to remove/replace, and finally n-arguments for the addition n-items to add
to the array.

```javascript
var animals = ["cat", "dog", "pork", "pig", "fish"];

// remove 'pork'
a.splice(2, 1);
// removed 'pork'
a > ["cat", "dog", "pig", "fish"];

// add 'snake' before item 2.
a.splice(2, 0, "snake") > ["cat", "dog", "snake", "pig", "fish"];
```

viola!

### Delete

The `delete` operator removes a property from an object. If will not remove the
property if it only exists on parent objects along the prototype chain. It is
useful for removing the property from a leaf object so that the property along
the prototype chain is used.

### Global Abatement

Global variables in general weaken the portability and resiliency of programs,
but in the case they're necessary, aim to limit them to a single global
variable. This is done by attaching all properties to a single global variable.

```javascript
var MYAPP = {};
MYAPP.views = {};
```

This will reduce namespace or scope collisions with other applications or
libraries.

### Reference

JavaScript passes objects around by reference, never by value.

```javascript
var x = {
  fn: "Jerome",
  ln: "Howard",
  nn: "Jer",
};
var y = x.nn; // new variable value: 'Jer'
x.nn = "curly";
console.log(y); // 'curly'
```

### Reflection

Reflection is the ability of a program to introspect is own code at runtime.

Javascript offers the `typeof` operator to check the type of a property, and
`hasOwnProperty()` which return true if the property exists directly on an
object, false if it does not (and possibly exists up the prototype chain.)

```javascript
var a_var = "a message";
typeof a_var;
> 'string'

var an_object = {
    a_prop: true;
};
an_object.hasOwnProperty('a_prop');
> true
```

### Functions

> "The craft of programming is the factoring of a set of requirements into a set
> of functions and data structures." <cite>Douglas Crockford</cite>

Functions encapsulate a set of statements. They enable code reuse, information
hiding and behavior composition.

Functions in JavaScript are objects. Objects are collections of name-value pairs
that have a hidden prototype link to `Object.prototype`. The Objects produced
from object literals are linked to `Object.prototype`. Function objects are
linked to `Function.prototype`&ndash; which is linked to `Object.prototype`.
Functions are also created with two additional hidden properties: the function's
execution context (lexical scope) and the source code that implements the
function.

Functions have a `prototype` property whos value is an object with a
`constructor` property whos value is the function. This is distinct from the
hidden link to `Function.prototype`. [](#ToDo: this needs to be fleshed-out in
more detail)

When invoked, functions receive two additional parameters: `this` and
`arguments`. The value of `this` depends on how the function was invoked
(invoked as method, invoked as function, invoked as constructor, and invoked as
apply). The value of `arguments` is an array-like object (in that the object has
a `length` property) of all parameters passed to the function when invoked.

#### Method Invocation Pattern

When a function is created as a property of an object, it is called a method.
When a method is invoked, it is bound to the object it is a property of. You can
tell a function is invoked as a method when it uses a refinement; a `.` notation
to call the function.

Functions invoked as a method can access the bound object using the `this`
reference to access other properties and values on that object. The methods
`this` object is late-bound at function invocation time. This makes methods that
make references to `this` more portable. These type of objects are called public
methods.

```javascript
var myObj = {
  value: 2,
  increment: function (inc) {
    this.value += typeof inc === "number" ? inc : 1;
  },
};
```

The binding of `this` happens very late, at invocation time. A method can use
`this` to retrieve values from the object, or modify the object.

Crockford introduces the `method` method, it is used throughout the book to
define new methods on existing objects. Crockford attaches it to the `Function`
prototype, so it is available to all objects.

```javascript
Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
};
```

A use of the `method` method would be to define a new function `predictLength`
on the String object. This function will return the predicted length a string
when concatenated with the existing string.

```javascript
// use Crockfords' `method` method on the `String` object.
String.method("predictLength", function (arg) {
  var len = this.length,
    argLen = arg.len,
    nextLen = len + argLen;
  var message = "Predicted length is %0 for string '%1'"
    .replace("%0", nextLen)
    .replace("%1", arg);
  console.log(message);
  return nextLen;
});
```

#### Function Invocation Pattern

When a function is not a property of an object, it is invoked directly as a
function:

```javascript
var sum = add(3, 4);
```

Any function invoked in this pattern, the `this` value is bound to the global
object. This becomes confusing for many developers when defining objects with
sub-functions that expect the value of the `this` value to refer to the
containing object. A example of problematic code illustrates:

```javascript
var brokenObj = {
  value: 2,
  double: function () {
    var helper = function () {
      // broken, the value of `this` in `this.value` refers to the global
      // Object, not `brokenObj`.
      this.value = this.value * 2; // fails, global Object.value set to NaN
    };
    helper();
  },
};
```

#### Constructor Invocation Pattern

If a function is invoked with the `new` prefix e.g.
`var x = new Status('confused')`, then a new object is created and returned with
a link to the value of the function's `prototype` property. The value of `this`
is bound to the new object.

```javascript
var Status = function (status) {
  this.status = status;
  this.valueOf = function () {
    console.info(`status ${this.status}`);
    return this.status;
  };
};
var happy = new Status("happy");
typeof Status === "function"; // true
typeof happy === "object"; // true
happy.valueOf() === "happy"; // true
("status happy");
true;
```

#### Apply Invocation Pattern

The `apply` method is available on every function. In the constructor invocation
pattern above, the `valueOf` method was bound to the local object. Instead, the
the `apply` method allows the developer supply an arbitrary value for `this`, in
effect allowing the developer to apply the method to any object rather than to
the object it is currently bound too.

```javascript
var DoMath = function (x, y) {
  this.x = x;
  this.y = y;
  this.sum = function () {
    return this.x + this.y;
  };
};
var oneTwo = new DoMath(1, 2);
oneTwo.sum() === 3; // true

// now we can force sum() to reference an object that we pass to the apply() method
var threeFour = {
  x: 3,
  y: 4,
};
oneTwo.sum.apply(threeFour, null);
7;
```

### Prototype

Every object is linked to a prototype from which it inherits properties. All
objects created with object literal syntax are linked to `Object.prototype`.
When creating new objects, we can select which object it inherits from. We can
use a method named `Object.create` to implement this behavior.

`Object.create`

```javascript
if (typeof Object.create !== "function") {
  Object.create = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}
```

The prototype link is used only in retrieval. If we try to retrieve a property
value from an object, it will either return the value on the object itself, or
look up to **its** prototype, and so on, until the lookup finds the property or
`undefined` is returned if nowhere along the prototype chain nor
`Object.prototype` has the property. This is called prototype retrieval
delegation.

If properties are added to a prototype, all children of that prototype will
immediately be available.

To determine if an object has a property directly, without invoking the
prototype chain, use `hasOwnProperty`.

```javascript
var ob = {};
ob.hasOwnProperty('newProperty');
> false
eb.newProperty = "a value";
ob.hasOwnProperty('newProperty');
> true
```

Prototypal inheritance

```javascript
// differential inheritance
var Mammal = {
  name: "A Mammal",
  says: "Noise",
  get_name: function () {
    return this.name;
  },
  speak: function () {
    return this.says || "";
  },
};
var myCat = Object.create(Mammal);
myCat.name = "Henrietta";
myCat.says = "meow";
myCat.purr = function (n) {
  var i,
    s = "";
  for (i = 0; i < n; i += 1) {
    if (s) {
      s += "-";
    }
    s += "r";
  }
  return s;
};
myCat.get_name = function () {
  return this.speak() + " " + this.name + " " + this.speak();
};
```

For-in loops

```javascript
var stooge_2 = Object.create(stooge);
stooge_2.first_name = "Harry";
stooge_2.last_name = "Moses";
stooge_2.nickname = "John";
for (var name in stooge_2) {
  console.log(stooge_2[name]);
}

delete stooge_2.nickname;
console.log(stooge_2.nickname); // 'curly'

// Method invocation pattern
console.log("===== Method invocation pattern ====");
var myObject = {
  value: 0,
  increment: function (inc) {
    this.value += typeof inc === "number" ? inc : 1;
  },
};

myObject.increment();
console.log(myObject.value); // 1
myObject.increment(2);
console.log(myObject.value); // 3
```

### Function invocation pattern

```javascript
myObject.double = function () {
  var that = this; // global this mis-assignment fix
  var helper = function () {
    that.value = that.value * 2;
  };
  helper(); // invoke helper as a function
};
// invoke double as a method
myObject.double();
myObject.value > 6;
```

### Constructor Invocation pattern

```javascript
var Quo = function (string) {
  this.status = string;
};
Quo.prototype.get_status = function () {
  return this.status;
};
var myQuo = new Quo("confused");
console.log(myQuo.get_status()); // 'confused'

// Apply Invocation pattern
console.log("===== Apply Invocation pattern =====");
var statusObject = {
  status: "A-OK",
};
// invoke the get_status method from Quo on our statusObject
var status = Quo.prototype.get_status.apply(statusObject);
console.log(status); // 'A-OK'

// Function Parameters
console.log("===== Function Parameters =====");
var sum = function () {
  var i,
    sum = 0;
  for (i = 0; i < arguments.length; i += 1) {
    sum += arguments[i];
  }
  return sum;
};
console.log(sum(4, 8, 15, 16, 23, 42)); // 108

// Exceptions
var add = function (a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw {
      // throw an object with a name and message property
      name: "TypeError",
      message: "add need numbers",
    };
  }
  debugger;
  return a + b;
};
var try_it = function () {
  try {
    add("seven");
  } catch (e) {
    console.log("name: " + e.name + " msg: " + e.message);
  }
};
try_it();
```

Object augmentation

```javascript
Function.prototype.method = function (name, func) {
  // add arbitrary functions with name name to our Object.
  this.prototype[name] = func;
  return this;
};
Number.method("integer", function () {
  return Math[this < 0 ? "ceil" : "floor"](this);
});
console.log((-10 / 3).integer()); // -3
```

### Lexical Scope

Lexical scope is the availability of variables to an executing block of code.
JavaScript lexical scope is determined by resolving objects in the immediate
lexical scope, then moving up the chain until it reaches the variables defined
in the global scope.

```javascript
var foo = function() {
    var a = 3,
        b = 5;
    var bar = function() {
        var b = 7,  // define local b
            c = 11; // define local c
        // a = 3, b = 7, c = 11
        console.log('a', a, 'b', b, 'c', c);
        a += b + c; // 3 + 7 + 11
        // a = 21, b = 7, c = 11
        console.log('a', a, 'b', b, 'c', c);
    };
    // now: a = 3, b = 5, c = undefined
    console.log('a', a, 'b', b);
    bar();
    // a = 21, b = 5
    console.log('a', a, 'b', b);
};
foo();
> a 3 b 5
> a 3 b 7 c 11
> a 21 b 7 c 11
> a 21 b 5
```

### Closure

A closure is a reference to a function as well as the runtime environment of the
function. This includes any variables within the lexical scope of the function.

```javascript
// addN returns a function that adds its argument.
var addN = function (x) {
  // x and the function below are in the same lexical scope
  return function (y) {
    return x + y;
  };
};

// add3: Return a function that adds 3 to its argument
var add3 = addN(3);
// add5: Return a function that adds 3 to its argument
var add5 = addN(5);
var resultOfAdd3 = add3(4); // 7
var resultOfAdd5 = add5(4); // 8
resultOfAdd3 > 7;
resultOfAdd5 > 8;
```

Additional examples of closures in JavaScript:

```javascript
var closureObject = (function() {
    var y = 0; // this variables lifetime is always available to
               // functions in the same lexical scope.
    return {
        increment: function(x) {
            y += typeof incrementBy === 'number' ?
                x :
                1;
        },
        getValue: function() {
            return y;
        }
    }
}());
// Assign the result of returning a self-executing function to
// closureObject.
// The function returns an object with 2 methods, each
// maintains access to the `y` variable.
closureObject.increment(3);
closureObject.getValue();
> 3

// Demonstrates the preservation of the lexical scope of execution.
var quo = function(status) {
    return {
        get_status: function() {
            return status;
        }
    };
};
var newQuo = quo('amazed!');
// newQuo still has access to the status parameter even after
// execution has ended and the lifetime of its lexical scope has ended.
// This is possible because the function has access to the lexical
// scope in which it was created. This is called a closure.
newQuo.get_status();
> 'amazed!'
```

Closure can be useful for things such as callbacks used in animation.

```javascript
var fade = function (node) {
  var level = 1;
  var step = function () {
    var hex = level.toString(16);
    var colorValue = "#ffff" + hex + hex;
    node.style.backgroundColor = colorValue;
    console.log("level " + level + " backgroundColor: " + colorValue);
    // step() maintains access to 'level' variable outside its execution scope via Closure.
    if (level < 15) {
      level += 1;
      setTimeout(step, 100);
    }
  };
  setTimeout(step, 100);
};
fade(document.body);
```

Using closure and setTimout to increment a local variable.

```javascript
for (var i = 0; i <= 10; i++) {
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, 1000 * i);
  })(i);
}
```

## Modules

> A module is a function or object that presents an interface but that hides its
> state and implementation.<br />
> —<cite>Douglas Crockford</cite>

Modules exist because developers _want_ to write code in discrete JavaScript
files, while [web] deployment _wants_ optimized code in as few HTTP requests as
possible. These interests are add odds with one another.

Modules aim to encapsulate a piece of code into a useful unit, and register its
capability/export a value for the module.

> The general pattern of a module is a function that defines private variables
> and functions; creates privileged function which, through closure, will have
> access to the private variables an functions; and that returns the privileged
> functions or stores them in an accessible place.<br />
> —<cite>Douglas Crockford</cite>

Douglas then defines a simple module using the function-closure pattern, which
returns an anonymous function to a global variable where the module will be
referenced.

```javascript
// SayModule: A function that simply console.log's its argument.
var SayModule = ( function() {
    var message = 'You said: {0}';
    return function(arg) {
        console.log( message.replace( '{0}', arg ) );
        return arg;
    }
}() );

var whatSaid = SayModule("hello world!");
> You said: hello world!
> 'hello world!'
whatSaid
> 'hello world!'
```

With many of these, module scripts are strung together in the DOM with
namespaces being described by a single global object where it's still possible
to incur naming collisions in the architecture.

CommonJS is a set of conventions used to define how JavaScript modules are used
and packaged. It defines the Module specification. This describes how code can
fetch and include external modules as a dependency using the `require("<name>")`
function. It also defines how authors export their code either by reassigning a
`module.exports` object, or adding properties to an `exports` variable. CommonJS
is most often used for synchronous loading of dependencies on server-side
systems such as Node.js.

AMD (Asynchronous Module Definition) is another specification for modules.
RequireJS is probably the most popular implementation of AMD. RequireJS was
designed to asynchronously load modules in a browser context. RequireJS
implements AMD, which is designed to suit the async nature of a browser.
RequireJS implements a `define()` function that allows the module to declare its
dependencies before being loaded. RequireJS can easily be wrapped by CommonJS
such that CommonJS modules can easily be included using RequireJS.

[Browserify](http://browserify.org/) is a CommonJS Module implementation that
can run in the browser. Browserify introspects JavaScript use of the CommonJS
`require()` function and builds a "bundle" that can be served in a single HTML
`<script>` tag.

[webpack](http://webpack.github.io/docs/what-is-webpack.html) is a module
bundler that aims to understand the needs of the developer as well as solve the
problems of delivering code modules efficiently in the browser. webpack uses an
opinionated configuration-over-code approach (similar to Grunt, but with more
opinions) vs Gulp, which requires much more manual wiring.

## WTF

```javascript
0.1 + 0.2 // 0.3? NOPE!
> 0.30000000000000004

x = 1.0000000000000001
x === 1
true // Huh?

y = {}
> y[[]] = 1
> Object.keys(y)
[ '' ] // HuH?
```

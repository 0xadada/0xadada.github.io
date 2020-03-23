---
title: "Ember Templates: Classic vs Angle Bracket Syntaxes"
displayTitle: "Ember Templates: Classic vs Angle Bracket Syntaxes"
date: 2020-03-20 16:14:00
metaDescription: "Diving into the difference between Ember component invocation when using curlies, angle brackets, and s-expression in Ember templates."
metaKeywords: ember, web development
metaOgType: "article"
image: /static/images/2020-03-20-ember-emplates-classic-vs-angle-bracket-syntaxes.png
metaImage: /static/images/2020-03-20-ember-emplates-classic-vs-angle-bracket-syntaxes.png
author: "0xADADA"
license: cc-by-nc-sa
tags: [projects, open-source]
---

This articles describes the difference between how component invocation differs
when using curlies `{​{...}}`, angle brackets `<...>` or an `(...)` s-expression in Ember templates.

Ember has three methods for invoking components and helpers in a template, either 
of the three can be used to invoke both classic and modern glimmer components.

The "classic" syntax in the form that uses curly braces `{​{...}}`, e.g.

```html
{​{user-profile firstName="Dan" lastName="F."}}
```

The "angle bracket" syntax that uses a HTML-like form `<... />`, e.g.:

```html
<UserProfile @firstName="Dan" @lastName="F." />
```

Finally the s-expression (for sub-expression) form used inside curly and angle 
bracket syntax to invoke a sub component or helper. This takes the form 
`(concat a " " b)`, thus:

```html
{​{user-profile name=(concat firstName " " lastName)}}
```

and

```html
<UserProfile @classNames={​{concat "sticky " (if this.isActive "is-active")}} />
```

## Angle Brackets

Similar to the vanilla DOM APIs that distinguish between 
[JS properties from HTML attributes](https://joji.me/en-us/blog/html-attribute-vs-dom-property/), 
angle bracket component invocations have two different namespaces you're operating against.

You are probably most familiar with HTML attributes, which tell the browser how to 
draw an HTML element. These attributes can do things like defining the `alt` text 
on an image `<img alt="A bird">` or the URL on an anchor tag 
`<a href="https://example.com">`. Angle bracket syntax implements attributes in 
a similar way, allowing the developer to apply these attributes to a DOM node 
somewhere in the component's template. 

```html
<!-- parent.hbs -->
<UserProfile class="abc" @tagName="figure" />
```

The `...attributes` syntax determines where the attributes passed into a 
component from an angle bracket invocation should appear in the component's 
template. Any number of attributes 
[and element modifiers](https://github.com/emberjs/rfcs/blob/master/text/0435-modifier-splattributes.md)
can be specified on the user profile component now, and they will all be applied 
to the element that has `...attributes` on it.

```html
<!-- UserProfile.hbs -->
<figure>
  <img ...attributes src="default.jpg">
</figure>
```

the resulting HTML output is:

```html
<figure>
  <img class="abc" src="default.jpg">
</figure>
```

Anything prefixed with `@` is an "argument", is passed to the component by its 
caller, is accessible to the class backing the component, and can be any JS 
runtime value. Unlike attributes, which tell the browser what to render, 
arguments tell your custom Ember component tag what to do.

```html
<!-- parent.hbs -->
<UserProfile @name="Dan F." />
```

This template invokes the `<UserProfile>` component, which expects one argument: 
`@name`, the value we pass is the hardcoded string "Dan F.". 

In the backing component class, arguments are namespaced on the `this.args` 
object, which is immutable. You can access this argument as:

```html
// user-profile.js
this.args.name; // "Dan F."
```

To illustrate the differences, here is an invocation of an angle bracket component 
using both arguments and attributes:

```html
<Foo @bar={​{123}} @baz={​{hash a=1 b='hi'}} class="hello" data-fizz="ok" />
```

In the above, `bar` and `baz` would be arguments with the values `123` and 
`{ a: 1, b: 'hi' }` respectively, while `class` and `data-fizz` would be 
attributes that could be applied to a DOM node somewhere in the component's 
template.

## Curly and s-expression Syntax

Ember curly (also called "classic") component invocation only have one namespace: 
the argument, everything is treated as an argument, as if you implicitly 
included `@` in front of each one. Historically, this was compensated for by 
automatically applying the value of the `class` argument to the `class` 
_attribute_ of a component's root element (if it had one), and this behavior 
could be extended to other attributes using the Ember classic `attributeBindings` 
API.

```html
<!-- parent.hbs -->
{​{user-profile bar={​{123}} baz=(hash a=1 b='hi') class="hello" data-fizz="ok"}}
```

In the above, `bar`, `baz`, `class` and `data-fizz` would all be treated as 
**arguments** to the receiving component, so any `...attributes` in its template 
would be a no-op. In Ember classic components, all of these arguments can be 
accessed in the backing component class using either the argument name alone,
`<argument name>`, or using `this.<argument name>`, thus:

```js
// user-profile.js
bar;      // 123
this.bar; // 123
baz;      // { a: 1, b: 'hi' }
this.baz; // { a: 1, b: 'hi' }
this.class;    // 'hello'
this['data-fizz']; // 'ok'
```

Usage in the template is:

```html
<!-- user-profile.hbs -->
{​{bar}}<br>
{​{this.bar}}<br>
{​{baz}}<br>
{​{this.baz}}<br>
{​{this.class}}<br>
{​{data-fizz}}<br>
{​{this.data-fizz}}
```

results in the following output:

```html
123<br>
123<br>
[Object]<br>
[Object]<br>
hello<br>
ok<br>
ok
```

It's important to note that both Ember classic and glimmer components can be 
invoked by either syntax: classic curly or angle brackets—and what matters is how 
the backing class is defined. Thus, if the above example was implemented as a 
modern glimmer component, the backing class must access the argument `bar` 
with `this.args.bar`. If the above example was implemented as a classic 
component, the backing class must access the argument with either `bar` or 
`this.bar`.

## So What's Missing?

For those following closely, you may have noticed that this leaves us with some 
kind of hole in the programming model, because there's no angle-bracket 
equivalent for setting up a contextual component to pass in as an argument or 
yield out as a block parameter. That's the topic under discussion at 
[Ember RFC issue #497](https://github.com/emberjs/rfcs/issues/497).

In the meantime, `<div class={​{@class}} local-class="whatever" ...attributes>` 
will ensure that a class applied to a component will pass through correctly 
regardless of how it's being invoked.

<aside>
  This article was adapted from a
  <a href="https://github.com/salsify/ui-localization/pull/44#pullrequestreview-340619675)" rel="external">PR comment</a>
  by <a href="https://dfreeman.io/" rel="external">Dan Freeman</a>.
  Thanks to
  <a href="https://twitter.com/jamscdavis" rel="external">James Davis</a>
  for proof reading this article.
</aside>

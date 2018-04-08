---
layout: page
title: "Best Practices for Writing CSS"
displayTitle: "Best Practices for Writing CSS"
date: 2013-03-01 20:01:00
metaDescription: "Conventions to help writing performant, maintainable stylesheets"
metaOgType: "article"
author: "0xADADA"
license: cc-by-sa
tags: [essays]
---

## General High-Order Principles

* Simplicity - The most bug-free line of code is the one you don't have
to write!
* Reusable - Create code that is portable to other sections of the site
and are nestable
* Extensible - Create code that lends itself to be easily extended and
with low selector specificity to promote extensibility.
* One-to-many - Create classes that can be applied to many contexts
* Fast - Know your selector performance basics, reduce HTTP requests
* Semantic - Create CSS that speaks to the task or meaning that is being
accomplished. Good CSS class names describe our HTML elements in very
semantic and specific ways
* Standards Oriented - Create portable, standards-forward code (ie Don't
use hacks)
* Future Proof - Write code as if you'll never be able to edit it again
* Accessible - Just as people have different capabilities with respect
to vision, hearing, language or cultural understanding, devices have
varying levels of memory, CPU, screen size or bandwidth
* Progressive - Create a core experience for the least capable devices
(legacy devices, low bandwidth, low power, small memory, small screen)
and progressively enhance the experience as you detect richer capabilities
* Fast to develop - Write code that is fast to create new features,
extend existing features, and maintain old features
* Team scalable - The code and conventions should be readily apparent to
a novice developer who joins the team, and easy to adopt so he/she can
quickly contribute

## Strive To

* Separate Structure from Skin
* Separate Skin from Behavior
* Separate Container from Content
* Create a Component Library - Use Components like legos, combining them
to create rich UI widgets. Create a reference page to see all components
in a single centralized place
* Separate components into generalized sub-groups: (Ordered from least to
most specificity)
  * All - The manifest that imports all other stylesheets
  * Settings - Global variables, public mixins, config switches, brand
colors, etc
  * Base - Base styles that normalizes globals, everything inherits
from these defaults
  * Objects - "o-" OOCSS design patterns, reusable UI primitives
  * Components - "c-" Fully designed pieces of UI, Still only utilizes
class selectors. More expliciltly named (e.g. products-list)
  * Trumps: Overrides, only affect on piece of the DOM at a time.
Usually carry !imporant.
* Your markup should be distilled from combining your component library
pieces together
* Minimize the amount of bespoke or one-off css-possible
* Extend Components by applying abstracted classes
* "Flow like water" - Be flexible, allow site to respond to content to
dictate height, and screen size to dictate width. Layout should respond
proportionally
* Use themes to separate ornamentation from core design
* Increase portability with context-free CSS

## Separate Structure from Skin

Focus on keeping your markup semantic. Don't write markup to achieve a
presentation-level effect, leave that to the CSS.

## Separate Skin from Behavior

Use CSS to skin your markup, but further separate your CSS from behavior.
If we use an anchor tag that acts as a form-POST event, write two classes;
one to describe the look of the button and another as its hint to
javascript that'll be used for attaching functionality.

**Markup**

    <a href="/action" title="Submit" class="c-button js-action-submit">Submit</a>

**CSS**

    .c-button {
        color: green;
        border: 1px solid red;
    }

**JavaScript**

    $( '.js-action-submit' ).click( function( e ) {
        e.preventDefault();
        // do form submit
    }

## Use themes to separate ornamentation from core design

Gradually tastes change like the seasons. The design team will continue
to evolve the graphic design as well as to create new design ornaments.
Rather than continually editing a large group of styles to integrate
these changes, strive to limit ornamentation to a set of core "theme"
classes that are applied to elements. Avoid editing a fragile selector
that includes layout and positioning properties that could potentially
break the site and instead limit your changes to a specific selector that
focuses on the ornamental effects of the element. An example helps:

**Markup**

    <!--Okay-->
    <a href="/contact" class="c-fun-button " title="contact us">Contact Us</a>
    <!--Better-->
    <a href="/contact" class="c-contact-button t-contact-button---fancy" title="contact us">Contact Us</a>

**CSS**

    /* Okay */
    .c-fun-button {
        display: inline-block;
        padding: 1em .5em;
        border: 1px dashed red;
    }

    /* Better */
    .c-contact-button {
        display: inline-block;
        padding: 1em .5em;
    }
    .t-contact-button---fancy {
        border: 1px dashed red;
    }

## Increase portability with context-free CSS

In striving to make components and elements that are easily moved,
extended and maintained; reduce the context that your css requires. For
this to work, your component must have:

* A unique name (css class) that will be part of the css selector
* No HTML element decendant selectors ( .menu li ) as these are inherently
context-dependent

Instead, use the unique name for the parent elements css selector, and
separate the child elements css class names with two – hyphens, for
example:

**Markup**

    <ul class=" c-navmenu ">
        <li>
            <a class=" c-nav-menu–-item ">an item</a>
        </li>
        <li>
            <a class=" c-nav-menu–-item ">an item</a>
        </li>
    </ul>

**CSS**

    .c-nav-menu {
        property-name: property-value;
        property-name: property-value;
    }
    .c-nav-menu–-item {
        display: inline-block;
        font-weight: bold;
        color: red;
    }

In this example, the menu items can be moved independently to other
parts of the site. And while this example might not occur in the real-world,
it would work- functionally-speaking.

If you need to extend the item to introduce a slightly different style,
you duplicate the class name, but add a modifier class separated by three
— hyphens.

**CSS**

    .c-navmenu-item---light {
        font-weight: normal;
        color: yellow;
    }

**Markup**

    <li>
        <a class=" c-navmenu–item c-navmenu-item---light ">an item</a>
    </li>

Extending our already-existing style by adding classes additionally gives
us a reusable class that we can then use anywhere we use the original class.

Avoid:

* Tag Specific selectors - Poor portability & reuse, unintended elements
inherit unwanted css properties
* #ID selectors - Poor selector performance & reuse, difficult to override
due to high selector specificity
* Alpha transparencies on top of irregular backgrounds - Poor rendering
performance
* Fixed "height:" Content is dynamic, changing, and heights will change.
Try to avoid height, there are many ways to avoid it
* Fixed "width:" Layouts should indicate proportionality and fit accordingly
inside their parent containers. Use box-sizing
* Relying on a defined HTML structure to drape your styles, markup changes
over time, and requirements change, components move
* Using javascript to modify css properties - don't pollute your
javascript with css

## Techniques

* Write your CSS selectors to be as concise as possible
* Write your CSS selectors to be as performant as possible, efficient as
possible and even more efficient
* Don't overqualify your CSS selectors
* Use the lessons learned in ["Object-Oriented" CSS](http://oocss.org/)

Every selector you write is additional complexity that will need to be
maintained. Can you generalize or abstract that selector so other
components can use it?

Make use of the child selector to limit how deep your css goes.
`.nav-list > li` can do a lot to prevent the cascade from going too deep.

Think of the class attribute in HTML as a mounting-point for CSS classes,
fixtures upon which styling is attached to markup. This is opposed to using
the markup as a skeleton on which you drape your style.

When asked to change existing code, rather than simply adding complexity
with new classes or additional selectors, can you refactor or abstract
existing selectors or classes to produce the desired behavior? Look at
change requests as an opportunity to refactor.

Code reuse is your friend. The first "C" in CSS stands for Cascade. Use
the cascade to maximum advantage. Inheritance is extremely powerful. When
adding a css property, ask yourself if you can add it higher in the cascade,
and inherit it from a higher abstraction.

Write obvious code. CSS is fragile, write code as if a novice coder would
be maintaining your code in the future.

"Extent your CSS objects with class" - not with selector specificity.
Increasing selector specificity makes overrides more difficult and fragile
to maintain. Class names can always be more semantic than the generic tag
names at your disposal.

Browsers actually have a very similar set of core default-styles. Rather
than obliterating the core-styles with a hard-reset css, think about the
value of css normalization. Using a normalized approach, the focus is to
normalize the differences across browsers rather than eliminating all styles
together. This means you spend less time re-creating the core styles that
are very useful in practice.

Create a UI Pattern and Component Library -
[MailChimp has a good one](http://mailchimp.com/__bananabin/components.html).

Elements that are effected by javascript behaviors should have css modified
by adding or removing classes. Keep your css in the css-file, don't pollute
the javascript with css properties when you could abstract those properties
to the css file. Elements that have multiple states should have corresponding
class names that describe those states when added to the element. The default
state of the element is when it has no additional descriptors in the class
attribute - the default state. For an anchor tag button, some additional
states class names could be:

    is-active
    is-disabled
    is-hover

## Adding Behavior

Class names are often used to add a behavioral hint that our javascript
will use to select an element and add some sort of behavior, ie: a tab
control made up of an unordered list with anchor tags inside list elements.
Clicking the anchor tag results in another container element showing or
hiding. Separate the behavioral hint by using a class name that indicates
its action.

    js-action-apply
    js-action-navigate
    js-action-cancel
    js-action-next
    js-action-play
    js-action-toggle
    js-action-clickable
    js-action-draggable

Avoid using these class names to apply css styles.

## Normalize vs Reset CSS

We have moved away from Eric Meyer's `reset.css` to
[`normalize.css`](https://github.com/necolas/normalize.css) for the
following reasons:

1. Normalize.css preserves useful defaults rather than "unstyling" everything.
For example, elements like sup or sub "just work" after including
normalize.css (and are actually made more robust) whereas they are
visually indistinguishable from normal text after including reset.css
1. Normalize.css corrects some common bugs that are out of scope for
reset.css. It has a wider scope than reset.css, and also provides bug fixes
for common problems
1. Normalize.css doesn't clutter your dev tools. A common irritation when
using reset.css is the large inheritance chain that is displayed in browser
CSS debugging tools. This is not such an issue with normalize.css because
of the targeted stylings
1. Normalize.css is more modular. The project is broken down into relatively
independent sections, making it easy for you to potentially remove sections
(like the form normalizations) if you know they will never be needed by
your website
1. Normalize.css has better documentation. The normalize.css code is
documented inline

For more reasons and rationale, check out the details About
[normalize.css](https://github.com/necolas/normalize.css/).

To get an idea what #3 means "Normalize.css doesn't clutter your dev tools",
as well as pollute the CSS cascade with unnecessary rulessets, checkout
the following example. In this image we compare the CSS rule chain for the
"About Us" title on the left with reset.css with 18 rules. On the right
is normalize.css with 11 rules.

As you can see, the ruleset on the right is far simpler, and unnecessary
complexity is always bad.

Further Reading

* [bem.info](http://bem.info) - Block-element-modifier approach to css
class naming conventions.
* [OO-CSS](http://oocss.org/) - "Object Oriented" CSS
* [Overqualifying Your Selectors](http://csswizardry.com/2011/09/writing-efficient-css-selectors/)- Writing efficient CSS selectors
* [Mozilla - Efficient CSS](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS)-
Mozilla article on fast CSS performance
* [CSS Tricks](https://css-tricks.com/efficiently-rendering-css/) - Efficient CSS Rendering

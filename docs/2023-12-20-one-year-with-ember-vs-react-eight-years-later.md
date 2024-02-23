---
title: "One (more) Year with Ember: Thoughts on Ember vs React, Eight Years Later"
description: "An examination of the similarities of Ember & React, some thoughts, and a conclusion."
tags:
  [
    essays,
    open-source,
    software-engineering,
    Ember.js,
    React,
    web-development,
    javascript,
    frameworks,
  ]
---

Six years ago, I [wrote a summary of my experience working with Ember for a year](https://0xadada.pub/2017/10/09/one-year-with-ember/).
I had been with Cinch Financial for a year, building their web & mobile apps with
Ember and Elixir/Phoenix. After Cinch I joined Salsify, a leader in the Ember
ecosystem, and shipped some great products built with Ember during my
five-year tenure. I built their Catalog Sites product using an Ember admin app
and a React/Next.js frontend. Building a single product with both frameworks was
enlightening as it provided a day-to-day experience with both.

> Almost a year of working in Ember, I'd like to summarize my thoughts about what
> makes it a great framework. There are a million articles comparing the big JS
> frameworks; this isn't one of those.

Almost eight years of working in Ember, I'd like to revisit some of the things
I said about Ember. There are a million articles comparing the big JS
frameworks, this one is mine.

## Ember vs React

React allows us to create _very declarative_ code, but to do it idiomatically,
the way _React wants_ takes quite a bit of experience and refinement to
_do it the right way_.
When examining purely declarative code, especially to the uninitiated, it can
be hard to comprehend when states are responding to events, and what their
downstream effects are. React code can be very composable, and their `useEffect`,
`useCallback`, `useState` primitives can be combined to create a wide variety
of functionality from these granular affordances.

With the composability of hooks, however, comes a level of complexity. We spend
a lot of time thinking through how different code is going to run, when it was
going to run, and how it could potentially interact with other hooks and code
around it. It all makes sense in the end, and it’s also declarative, but it’s
a bit harder to follow the intent all the way through.

React (for most of us) is usually only legible in motion, not at rest. This is
to say that the only way to figure out how a given piece of React code works is
by prodding it through use, it's not enough to just read it.

**Differences in developer feeling of focus** Reacts dogmatic re-running of a
component when its state changes forces developers to consider _all_ starting
and possible states, and their dependencies. It requires juggling a lot of
context on the part of the developer, and that is why _reducing state to the
minimum_ is considered a best practice.
By contrast, Embers autotracking makes component development _feel_ a lot
less complicated, and **an Ember developer can focus more on intent while React
developer _feels_ they must focus more on exactitude**.
These are just feelings, but they’re there.

**Ember is more baroque** with its `@action` and `@tracked` decorators,
its template control logic with `{{#if}} {{#each list of |item|}}` and
its native classes. With this baroque-ness however, comes an additional level
of legibility one gets from reading Ember code. Ember code feels familiar
everywhere, and separating arguments(props) from attributes really helped to
clarify intent.

_Ember suffers from a small and shrinking ecosystem_. This could be due to
early technical decisions that required all 3rd-party Ember npm packages
to specifically adhere to Ember addon requirements. This meant that regular
npm packages couldn’t be used in Ember apps until `ember-auto-import` arrived,
and later, Embroider. Unfortunately this means most Ember addons aren’t
compatible with the wider javascript ecosystem, and many Ember packages
languish or are abandoned once maintainers move away from Ember. This means
the Ember core-team is burdened with adopting these orphaned packages or risk
losing them to the shifting sands of time.

### Direct Comparison

When speaking to Ember devs about React, or React devs about Ember, I frequently
use this chart to map concepts in one to the other:

| **Concept** | **Ember** | **React** |
|:--|:--|:--|
| **File structure** | Convention<br />`app/components/component.js`, `app/components/template.hbs` | Configuration<br />use `import` to bring files from wherever, file may contain both logic and template. |
| **Component primative** | JavaScript classes | JavaScript functions |
| **Rendering** | Glimmer VM | React DOM |
| **State transition detection** | `@tracked` decorator with autotracking provided by the framework | `React.useState()` function with dependency keys and memoization |
| **Component lifecycle** | Use the classes `constructor()` to initialize the component for first-render and reuses that instance for the life of the component. | Components are pure functions, relies on memoization or `useEffect` to run code conditionally after initial render. |
| **Event handling** | `@action` decorator to bind context to event callback functions that respond to user inputs, event handler must be referred to in templates using Ember modifiers e.g. `{{on 'click' (fn this.handleEvent value)}}` and use the `fn()` helper to bind arguments to the callback. | Pure function callbacks that are lexically in-scope and bound using standard closure `onClick={() => handleEvent(value)}` style invocations. |
| **Template lexical scope** | Double curly `{{this.value}}` which requires `this` to reference lexically scoped variables available in the class. | Single curly interpolation `value={value}` which is directly bound to the functions lexical scope. |
| **Template interpolation** | Sigils `@value={{this.value}}` to distinguish component arguments from standard HTML attributes. Ember requires using `...attributes` to spread HTML attributes to HTML tags. Use `{{yield}}` to render child components. | No difference between component props and HTML attributes. | React spreads __all__ props down to HTML children. Use `{children}` to render child components. |
| **Template Control Logic** | handlebars/HTMLbars<br />iteration<br />`{{#each @list as item}}<Item />{{/each}}`<br />conditionals<br />`{{#if true}}its true{{else}}not true{{/if}}` | pure javascript<br />iteration<br />`lilst.map(item => <Item />)`<br />conditionals<br />`{item.isTrue ? <TrueItem /> : <FalseItem />}` |
| **Global State Management** | Ember Services | React Context API, React Query |
| **Application Routing** | Ember Router | React-Router (not built-in) |

## Eight Years On

Revisiting [my original post](https://0xadada.pub/2017/10/09/one-year-with-ember/),
I'd like to provide some updates to that thinking:

> Ember feels familiar…

Ember still feels familiar, _especially_ for teams that work across many Ember
repos. **Ember teams are very productive because of Embers
convention-over-configuration approach**.
An Ember app is an Ember app is an Ember app. **This familiarity isn’t always
typical with React apps**. React apps are to-each-their-own, and teams need to
spend time to make their apps feel familiar enough to be seamless when moving
between repos.

> There is a single "Ember way" of doing things…

This isn’t as true as it used to be. Ember is wonderfully backwards compatible,
but that also puts it into an awkward position when it comes to writing
idiomatic Ember applications: It has become very difficult to discern
_what is idiomatic Ember_, especially in real-world app ecosystems where you
may have apps using Ember (classic) or Ember Octane, or an in-between state.
Ongoing projects like template imports will make Ember apps even more difficult
to determine what is "idiomatic".

At Salsify, there are a handful of Ember-gurus who shepherd the engineering org
towards idiomatic Ember, but the average engineer doesn't necessarily know when:

- `Ember.get/set` vs. native getters/setters
- `Component.extend({})` vs `class Component extends Component {}`
- invoke component with `{{my-component}}` or `<MyComponent />`
- render a value with `{{value}}` or `{{this.value}}` or `{{@value}}`
- when to use `@tracked` or `@action`

The [Ember cheat sheet](https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/)
is a great resource, but its there because people aren’t confidant. Tools like
`eslint`, `prettier`, `stylelint` and others help migrating to idiomatic
conventions.

## Concluding

Ember and React are both great. There are tradeoffs on both sides. The answer
is always _it depends_. React with class Components is very similar to Ember
Classic. Ember is an amazing upleveler for bigger teams with
novice and expert developers working across multiple codebases building
ambitious applications. React is elegant in its simplicity, can be pure and
precise. React has an amazing ecosystem, and is used to create enterprise
applications. Ember has a larger API surface area, and while it seems to
have a higher learning curve, I’d argue that it takes longer for an engineer
to become an expert at React: _one having the ability to see the forest
for the trees._

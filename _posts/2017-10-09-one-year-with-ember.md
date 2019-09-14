---
layout: longread
title: "One Year with Ember"
displayTitle: "One Year with Ember"
date: 2017-10-09 20:26:00
excerpt: "Thoughts on Ember after a year of use."
metaDescription: "Thoughts on Ember after a year of use."
metaKeywords: javascript, frameworks, web development, software development, progressive web apps,
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [essays, open-source]
---

In early 2015, I was working at an artificial intelligence startup. My team was planning to build a web application to connect to our neural network platform. The team as a whole had experience (on the AI–side) with Python, and the web team had a lot of experience using Django. We'd implemented a hybrid-app in Cordova using Backbone.js the previous year. My task was to evaluate the state-of-the-art in the frontend development landscape. 

I included React, Angular and Ember to the list of contenders for comparison. We read the docs, implemented [ToDo MVC](http://todomvc.com/) apps, prototypes, and reviewed the community. We produced comparison spreadsheets and went to local meetups. We reviewed design docs and discussed the merits of each approach. Finally, we discussed our findings. Both Ember's FastBoot and React's server-side pipeline were not yet ready for production. The Angular community was in flames from the v2 rewrite. Angular 4 was yet another rewrite that was shaping up to look disastrous. The core Angular team had abandoned ship. Instead of making a final decision on a framework, the team wanted to wait until we understood more of our applications use cases.

**TL;DR**: We decided to defer the decision. Instead we wrote the app with a "NOJS-first" approach. The implementation was simple, using HTML forms. Using progressive enhancement, we could add a richer frontend in the future.

The experience investigating Ember stuck with me. Ember was using web-standards and best practices. Convention-over-configuration came from Ruby on Rails. It borrowed performance UI rendering strategies from React. It had a first-class testing and documentation story much like Django. Ember was distilling the best ideas and practices and placing them at the core of their project.

A year later, our decision was working out well, and the project was humming along. It was well-tested, performant, and had frequent new feature additions. I decided a change of pace would be fun and challenging. The app was in good hands.

When starting my job search, I focused on companies that were using Ember. One of the major considerations for my next job was getting my hands deep into Ember. In November 2016, I joined a startup using Ember to build a personal finance application.

Almost a year of working in Ember, I'd like to summarize my thoughts about what makes it a great framework. There are a million articles comparing the big JS frameworks; this isn't one of those. This article focuses on what keeps me happy about the decision to continue using Ember.

**Ember feels familiar** to anyone coming from developing basic HTML/JS/CSS sites, WordPress, Ruby on Rails apps, or even Django apps. You have template files, you have JavaScript files, and you have CSS. You're not writing markup, JavaScript or CSS in JS files. The templates are much like Mustache. It feels like you're writing code for the web.

**You spend little time in configuration** relative to building application features. The framework defaults work well. Ember's architecture is better known as “convention-over-configuration”. The core team dedicates time and resources to understand how the community uses the framework. This helps them bake-in best practices as the defaults. 

**There is a single "Ember way" of doing things** with the framework. This aspect of Ember is one of its biggest benefits. When the community grapples with problems that span applications, the core team distills common solutions by defining well-crafted abstractions. It's amazing how quickly an opinionated framework can help you see patterns in your project, and solve problems using framework abstractions. These abstractions also make it easier to follow best practices without thinking about it. Good examples of these are the build system, the pluggable deployments system, and routing. In the end, developers focus on building features rather than making many small decisions around 3rd party libraries and app configuration.

**Ember has a bigger learning curve** than React, but smaller than Angular. This statement is misleading because Ember is solving more problems than React. React is only the 'V' in MVC, while Ember is solving the problem of building complete applications. A fair comparison would be between the learning curve of Ember vs React with Redux, Apollo, React Router, Koa, Relay, and Webpack. Ember provides a solution _as well as a converging ecosystem_ for building modern web applications. Ember's design is to solve application-level problems. This means no liabilities around custom code that wires libraries together. This design eliminates a class of problems where library bounderies don't connect. Worse even, is when inconsistencies get introduced because libraries have overlapping concerns. 

**Web standards are important** in the Ember community. The core team adds new features with an eye towards standards organizations such as the W3C and ECMAScript TC39. Features are first adopted in an Ember-specific way (i.e. Ember.RSVP); allowing developers to use these features before the standard has landed. Eventually these "welcome mats" get replaced with the final standards-based implementations. This ensures that the framework will not only keep pace with, but stay ahead of and influence the standardization process. This also adds a degree of future-proofing into the framework.

**Ember makes it easier to stay up to date** with the latest and greatest framework features. With an all-in-one architecture, everything is well tested, and works together as versions move ahead. Addon authors can use packages like `ember-try` to test against various versions. Finally, the Ember team takes a responsible approach as it moves along the roadmap ([it has a roadmap!](https://emberjs.com/statusboard)). The project has a long-term vision, and the core libraries align their roadmaps on a 6-week release cycle. The release team flags deprecated features and wrapping new ones in feature flags. This allows developers to safely test out new APIs and responsibly sunset deprecated ones.

**CSS organization becomes trivial** if you let the CSS follow Ember routes and components. Pair any page-oriented CSS with the route-template, and pair the majority of your CSS with components. Combine this with a solid CSS framework like Bootstrap, Foundation, Bulma- and you've made long-term CSS maintenance easier.

After a year of working in Ember, attending EmberConf 2017, visiting meetup groups, and talking with folks in Slack, I'm sold. It's a pleasure to work in, and the roadmap ahead points to a bright future. Tree-shaking and improvements in static analysis are shaping up to help break the app into smaller pieces for faster delivery over the wire. I look forward to the next year using Ember.

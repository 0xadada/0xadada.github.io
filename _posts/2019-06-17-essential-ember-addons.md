---
layout: long
title: "Essential Ember Addons"
displayTitle: "Essential Ember Addons"
date: 2019-06-17 22:23:00
metaDescription: "a list of Ember addons that I use in most of my projects"
metaKeywords: ember, ember.js, addons, ember addons, web framework, web development, programming, software engineering
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [projects]
---

# Essential Ember Addons

In this article I’d like to present a list of Ember addons that I use in most of my projects. I've been using Ember for the last few years as my go–to framework for developing web applications, and many of these addons make appearances in nearly all of them.

Ember addons generally fall into one (or more) category of functionality I'll be referring to throughout this guide:

- **Build-time** Build-time addons provide command-line tools that help developers during the creation of the application. An example is `ember-cli-eslint` which provides code linting, or `ember-cli-typescript` which adds a build pipeline for transforming TypeScript files into JavaScript files. These addons don't ship features to your deployed application. These addons typically start with the prefix `ember-cli-`**.**
- **Runtime** Runtime addons provide features that will be present in the final application,
these include Ember components like `ember-power-select` and `ember-svg-jar` these addons increase the payload of the deployed application. These addons typically start with the prefix `ember-`
- **Infrastructure** Infrastructure addons provide features that aren't shipped with the payload of your application, but provide functionality that improves the development ergonomics or deployment of the project. For example `ember-cli-fastboot` provides a backend Node.js  server for rendering Ember apps serverside.
- **Quality Assurance** Quality assurance addons provide tools for improving quality of code over time, and improving the developer experience of writing and testing code. These addons typically provide functionality that is used at build and test time, but isn't shipped to your deployed application. `qunit-dom`, `coveralls`, and `ember-test-selectors` are examples of quality assurance addons.

Some of these addons are included by default by `ember new <project-name>` but I'll elaborate on their use a bit more.

Finally, before diving into the addon list, I won’t be discussing many standard JavaScript packages. There are a bunch of JavaScript packages that I often use (`ramda`, `lodash`, etc) but these are outside of the scope of this article.

## Contents

- [General Purpose Addons](https://www.notion.so/0xadada/Essential-Ember-Addons-f3d4cea3d88341619daa9544b0542ded#general-purpose-addons)
    - [ember-a11y-testing](#ember-a11y-testing)
    - [ember-auto-import](#ember-auto-import)
    - [ember-cli-update](#ember-cli-update)
    - [ember-cli-code-coverage](#ember-cli-code-coverage)
    - [ember-cli-dependency-lint](#ember-cli-dependency-lint)
    - [ember-cli-deprecation-workflow](#ember-cli-deprecation-workflow)
    - [ember-cli-document-title](#ember-cli-document-title)
    - [ember-cli-dotenv](#ember-cli-dotenv)
    - [ember-cli-template-lint](#ember-cli-template-lint)
    - [ember-test-selectors](#ember-test-selectors)
    - [ember-truth-helpers](#ember-truth-helpers)
    - [eslint-plugin-ember](#eslint-plugin-ember)
    - [eslint-plugin-prettier](#eslint-plugin-prettier)
    - [prettier](#prettier)
    - [qunit-dom](#qunit-dom)
- [Specific Usecase Addons](https://www.notion.so/0xadada/Essential-Ember-Addons-f3d4cea3d88341619daa9544b0542ded#specific-usecase-addons)
    - [ember-cli-addon-docs](#ember-cli-addon-docs)
    - [ember-cli-bundle-analyzer](#ember-cli-bundle-analyzer)
    - [ember-cli-deploy](#ember-cli-deploy)
    - [ember-cli-mirage](#ember-cli-mirage)
    - [ember-cli-page-object](#ember-cli-page-object)
- [Conclusion](https://www.notion.so/0xadada/Essential-Ember-Addons-f3d4cea3d88341619daa9544b0542ded#conclusion)

## General Purpose Addons

These addons are used in nearly all my projects, I often install and configure them right after I've created a new project.

### ember-a11y-testing

[ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing) is a quality assurance addon that integrates into the existing Ember test framework, adding tests that check for accessibility problems. The addon leverages the wonderful [axe-core library](https://github.com/dequelabs/axe-core) to test for form labels, high contrast colors, ARIA attributes and much more.

### ember-auto-import

Ember apps can import standard NPM libraries, but it isn't straightforward; until now. 

[ember-auto-import](https://github.com/ef4/ember-auto-import) is included with the new Ember Octane edition. It is a build time addon with optional runtime lazy-loading that enables developers to use import statements from standard NPM packages without having to wrap it in an Ember addon or manually wire it into the build by adding it to `ember-cli-build.js`

Now we can just:

    $ ember install ember-auto-import
    $ yarn add -D lodash-es

and in your code:

    import { capitalize } from 'lodash-es';
    let nameUpper = capitalize('edward faulkner'); 
    // Edward Faulkner

### ember-cli-update

[ember-cli-update](https://github.com/ember-cli/ember-cli-update) is a build time addon that adds the `update` sub-command to the Ember CLI. This command incrementally updates your app or addon to the latest Ember CLI version. It does this by fetching the latest version and comparing it to your project's Ember CLI version. It then applies a diff of the changes from the latest version to your project. It will only modify the files if there are changes between your project's version and the latest version, and it will only change the section necessary, not the entire file.

This tool gets regular use over the lifecycle of all the Ember apps I maintain. 

### ember-cli-code-coverage

ember-cli-code-coverage is a quality assurance addon that runs at test time. The addon introspects the code running during tests and analyses which code branches were run and how often. It generates a report showing your source code and which branches are covered by tests. This allows you to write test code that covers all code branches. The report looks something like this:

    3x  export function asset(param) {
    8x    const rootURL = config.rootURL ? config.rootURL : '';
    8x    return `${rootURL}${param}`;
        }

Coveralls is a code-coverage-report-as-a-service provider that tracks your projects code coverage over time. The tool auto-uploads your coverage report after tests are run.

### ember-cli-dependency-lint

[ember-cli-dependency-lint](https://github.com/salsify/ember-cli-dependency-lint) is a build time addon that will lint your app's addon dependencies, making sure your app or addon has only one version of any dependency. If your app has multiple versions, which is actually packaged in the final build? This situation can lead to anything from hard exceptions to subtle behavioral bugs. 

    my-app
    ├─┬ ember-modal-dialog
    │ └── ember-wormhole@0.3.6
    └─┬ ember-power-select
      └─┬ ember-basic-dropdown
        └── ember-wormhole@0.5.1

This addon will throw a build error until the developer explicitly resolves the dependency either by pinning the dependency with a resolution, or updating the addon with the outdated dependency.

### ember-cli-deprecation-workflow

ember-cli-deprecation-workflow is a runtime addon that comes in handy whenever you are updating Ember.js or Ember Data, you'll eventually get deprecation warnings that need to resolved. In the meantime the console is filled with deprecation warning noise.

The addon listens for deprecation warnings in the console, and adds each to a list. It allows you to add each deprecation warning to a config file where you can work through resolving the deprecations one-by-one.

### ember-cli-document-title

ember-cli-document-title is a runtime addon that lets you update the document `<title>` on a per-route basis. It lets you define the title directly on a `title` field on any route:

    // app/routes/post.js
    export default Ember.Route.extend({
      title: 'A fresh new post 🥖'
    });

This addon should probably be part of Ember core.

### ember-cli-dotenv

ember-cli-dotenv is an addon that allows your app to consume environment variables at build time, as defined in a `.env` file:

    API_HOST=https://api.webapp.dev
    API_TOKEN=CHANGEME
    API_SECRET=CHANGEME

This addon reads these variables and exposes them through the built-in `config/environment.js` that you can then import in your app wherever you need them. You might want to make your API endpoint URL, port, or any secrets configured as environment variables.

### ember-cli-template-lint

ember-cli-template-lint adds lint tooling for handlebars templates to the ember-cli. The lint rules are also automatically added to the test runner so the rules are tested against during `ember test` runs. This addon was recently integrated into Ember core as a default addon.

### ember-test-selectors

ember-test-selectors helps you write tests that look more semantic, and with less churn between refactors. This is because the pattern leads you do bind your tests to a test selector that shouldn't change during a refactor (instead of directly to an HTML tag). 

If your component produces HTML markup like this:

    <!-- before ember-test-selectors -->
    <h1>{{post.title}}</h1>
    
    <!-- after ember-test-selectors -->
    <h1 data-test-heading>{{post.title}}</h1>

You'd change your testing patters to something like this:

    // without ember-test-selectors
    assert.dom('h1').hasText('Example text'); /* you've explicitly tied the test harness
                                               * to an HTML tag <h1>.
                                               */
    
    // with ember-test-selectors
    assert.dom('[data-test-heading]').hasText('Example text') /* Now you're free to change
                                                               * the HTML tag under test to
                                                               * anything, and the test
                                                               * assertion is less context
                                                               * dependent.
                                                               */

The test hooks, bindings, and data are removed from production builds leaving your live code running quickly, and clean of any test artifacts.

### ember-truth-helpers

ember-truth-helpers is a runtime addon adding a set of useful handlebars template helpers for additional truth logic, useful in `if` statements. 

    {{if (eq a b)}}
    {{if (not-eq a b)}}
    {{if (not a)}}
    {{if (and a b)}}
    {{if (or a b)}}
    {{if (xor a b)}}
    {{if (gt a b)}}
    {{if (gte a b)}}
    {{if (lt a b)}}
    {{if (lte a b)}}
    {{if (is-array a)}}
    {{if (is-empty a)}}
    {{if (is-equal a b)}}

### qunit-dom

One of my favorites, qunit-dom is a quality assurance addon that makes for more elegant test assertions against DOM elements. Given the following rendered Ember component:

    <div class="ember-view">
      <p class="copy">This is great</p>
    </div>

and some example test code, before and after:

    // before qunit-dom
    assert.equal(this.element.querySelector('.copy').textContent.trim(), 'This is great');
    
    // after qunit-dom
    assert.dom('.copy').hasText('This is great');

Combining qunit-dom with ember-test-selectors makes for even more powerful test assertions that are independent of the DOM, and all test artifacts are stripped from production builds.

    <div class="ember-view">
      <p class="copy" data-test-copy>This is great</p>
    </div>

    // combining qunit-dom and ember-test-selectors
    assert.dom('[data-test-copy]').hasText('This is great')

### eslint-plugin-ember

eslint-plugin-ember adds Ember-specific ESLint rules to your ember app, and comes with a [great set of recommended defaults](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/recommended-rules.js) that are updated as the community coalesces around best practices. This addon will keep your app code looking clean and tidy, and nudges the code along a path of best practices.

This addon was integrated into the core as a default addon in Ember 2.18.

### eslint-plugin-prettier

Prettier is an opinionated code formatter, and eslint-plugin-prettier runs the format rules as an ESLint rule; it reports differences as errors or warnings as ESLint issues. This allows you to catch formatting discrepancies in your editor as well as in CI builds. Prettier rules can be applied automatically in your editor, or by ESLint using `eslint --fix`.

### prettier

Prettier is not an Ember addon, but a package I use in all my Ember projects. Prettier is a code formatter that can automatically format the code in your editor (vim, VS Code, etc all have plugins) as well as detecting formatting issues test time. Super useful for teams trying to maintain a consistent looking codebase.

## Specific Usecase Addons

The following addons may not be generally applicable to all applications. I may not use them in all my projects but, when I need the capabilities they offer, then I will reach for them. For example, if I need to authenticate users with an OAuth provider like Facebook or Twitter, I use `ember-simple-auth`.

### ember-cli-addon-docs

[ember-cli-addon-docs](https://ember-learn.github.io/ember-cli-addon-docs/) is a build time addon that creates an interactive sandbox for versioned addon documentation. This tools is wonderful for addon (and app developers!) who need to maintain versioned documentation. This addon lets the developers write their code and not have to think about how the documentation is presented, generated, versioned. The addon has its own code syntax highlighting, interactive live demos, and more.

### ember-cli-bundle-analyzer

ember-cli-bundle-analyzer is a build-time tool that creates a visualization chart allowing you to  view the size and contents of an app's bundled output, with their relative and overall sizes. This tool is essential for determining which packages have the largest impact on the deployment size of your application payload.

### ember-cli-deploy

ember-cli-deploy is a build time addon that implements a deployment pipeline to upload and activate your Ember app on a variety of hosting providers. It uses a plugin architecture allowing you to find a plugin to deploy to AWS, GCP, and many many more.

### ember-cli-mirage

ember-cli-mirage is an addon for mocking backend API responses on the client. It runs in both development mode and testing mode to help you write, test, and prototype your app without forcing you to write the backend parts first. The killer feature is how it unlocks your ability to do FDD (frontend driven development)— you can build frontend features that don't depend on a backend by mocking the backend in mirage. You can continue modifying mirage requests alongside your frontend feature. Then when the frontend is feature complete, you have established a set of clear patterns you can then implement on the backend of your choice. Mirage is also used during testing, intercepting and mocking API requests instantly so the tests can run more quickly, without making any external network requests.

### ember-cli-page-object

ember-cli-page-object is a test-time addon making it easy to follow the page-object pattern by Martin Fowler.  Page objects allow you to define the shape of a DOM page in an Ember acceptance test or integration test. They tell your code *what* to interact with, but do not make assertions about those objects. Your tests then reuse this object. This reduces duplication of DOM selectors in your tests, making your test code less fragile and much easier to refactor.

### ember-cli-release

ember-cli-release provides a CLI building your package, auto-incrementing version numbers, and publishing the packages to a package repository. This is more useful for Ember addons that typically conform to semver conventions, but can be used for engines and applications equally.

### ember-cli-typescript

ember-cli-typescript is a build time addon enabling you to write TypeScript in your Ember apps. It hooks into the build pipeline and transpiles TypeScript to JavaScript, and also supplies many of the type definitions for the Ember source code.

### ember-cli-fastboot

ember-cli-fastboot is an infrastructure addon. It enables server side rendering of your Ember application. FastBootruns your application in Node.js so when a user visits your site, they are delivered a fully rendered static HTML page, and only after the content has loaded do they start downloading JavaScript. Once finished, your Ember app takes over, delivering a typical SPA experience. The best of both worlds.

### ember-cli-fastboot-testing

ember-cli-fastboot-testing is a quality assurance addon that allows you to write tests against your Ember app running in the Node.js server context. Since FastBoot runs Ember not in the browser but in a Node.js process, the standard Ember testing tools don't apply. This addon lets you write acceptance tests that can excersise code running on the FastBoot server.

### ember-concurrency

ember-concurrency is a runtime addon that makes it easier to write asynchronus code that support cancelation, restarting, expose their internal state, and much more. This addon makes the difficulty of managing state transitions much easier.

### ember-css-modules

ember-css-modules is a built time addon enabling you to write component-oriented CSS. Your styles become private to a component, route, or controller, with explicity features to allow style sharing and composition. It works by making each CSS file its own isolated namespace by transforming class names to ensure they're unique. Your `.css` files are now peers of your component `.hbs` and `.js` files.

### ember-intl

ember-intl is a runtime addon for building internationalized Ember apps, has helpers for tranforming strings into multiple locales, formatting for messages, date/time formats, number, and relative time manipulation. Provides translations using the ICU Message Syntax standard with pluralization support.

### ember-intl-analyzer

ember-intl-analyzer is a quality assurance addon providing tools to help you analyze an internationalized app and will locate unused translations.

### ember-fetch

ember-fetch is a runtime addon providing an alternative to AJAX requests. It allows the app to make network requests. ember-fetch is useful for applications needing to support network requests in both a browser and FastBoot context, and do not need to depend on jQuery.

### ember-power-select

ember-power-select is a runtime addon providing a powerful, and extensible `<select>` dropdown component that is highly customizable.

### ember-simple-auth

ember-simple-auth is a runtime addon for implementing authentication and authorization. It maintains an authenticated client side session, authorizes network requests, and provides helpers in authentication flows like OAuth.

### ember-svg-jar

ember-svg-jar is both a build and runtime addon that improves the developer ergonomics around working with SVG assets. It adds a build-time pipeline that discovers SVG files in the project repo and packages them as Ember templates. These are then inlined into your app with an Ember template helper `<SvgJar "[ASSET_NAME]">` that embeds the SVG directly into the markup of your page, without an additional network request. It also has a beautiful visual directory route displaying all the SVG assets in your app.

## Conclusion

The above addons should cover most of your Ember needs. I have only listed addons with good documentation, test coverage, and that continue to be maintained. If you need anything more or want to take a general look at some of the addons that have are available I recommend starting with [ember-observer.com](https://ember-observer.com).
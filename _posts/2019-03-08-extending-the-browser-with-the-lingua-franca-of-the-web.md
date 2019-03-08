---
layout: long
title: "Extending the browser with the Lingua franca of the web"
displayTitle: "Extending the browser with the Lingua franca of the web"
date: 2017-10-09 20:26:00
excerpt: "A browser extension adds features to a web browser. They're created using standard web technologies— JavaScript, HTML, and CSS"
metaDescription: "Understanding WebExtensions; how to create browser extensions  using standard web technologies— JavaScript, HTML, and CSS."
metaKeywords: webextensions, web extensions, browser extensions, browser plugins, javascript, web development, software development, progressive web apps
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [essays, open-source]
---

A browser extension adds features to a web browser. They're created using standard
web technologies— JavaScript, HTML, and CSS. Extensions can run JavaScript 
permanently in the background or can run on any page the user visits. Extensions 
can also specify popup windows and options pages. 

All modern browsers increasingly support a standard called the WebExtensions 
API. This API provides extensions the additional functionality to add or change 
the core features of the browser. Extensions developed to follow the WebExtensions 
API will in most cases run in Firefox, Chrome, Opera, Brave, and Edge with just 
a few minor differences.

An extension will typically be a composition of _any or all_ of the architectural 
parts of the extensions API:

![web extension architecture](static/images/2019-03-08-architecture.png)

* **background scripts** Are essentially JavaScript running in a hidden tab, 
loaded when the browser starts and run continually. Background scripts are where
extension authors write code that handle global browser events and respond to
actions. They maintain long-term state, or can perform long-term operations. 
This code runs independently of any any particular web page or browser window.
* **content scripts** Are JavaScript and CSS loaded into any web page whose URL 
matches a specified pattern. This code can be written to modify web pages (e.g. 
AdBlockers), or add features to web pages.
* **browser actions** A button and icon that the extension 
adds to the browser's toolbar that can trigger events. These actions _may_ have 
a **popup**.
* **popup** A popup is really just another hidden tab which is shown when 
the extensios toolbar icon is clicked. The content of a popup is specified using 
HTML, CSS, and JavaScript. popup.html (in blue, below) is a basic html page that 
is loaded into the popup window, but can also be opened in another browser tab 
just like any other html page (if you know the extension URL).
* **page actions** Similar to browser actions, but these can add menu items to 
the on-page context menu, and can also open a popup window.
* **options pages** An extension can also specify additional pages that are 
available as popup windows, often offering extension preference panels.

![different parts of an extension](static/images/2019-03-08-components.png)


## Creating a simple extension

Every extension _must, by definition_ define a `manifest.json` file, which is 
the only file that every extension using WebExtension APIs must contain. The 
`manifest.json` specifies basic metadata about an extension, and also resolves 
how the code in the extension is loaded, including content scripts, background 
scripts, and browser actions.

In order to work in all modern browsers, a few fields must be defined in 
`manifest.json`:
* `manifest_version` defines the WebExtensions API level (2 is the current 
  version)
* `name` the extension name
* `version` version of the addon
* `author` name of the person or organization (required by Edge) who wrote the 
  extension

A few other key fields are optional but highly recommended:
* `description` text displayed in the Extension UI and in the extensions app 
  stores
* `icons` will be shown in the browser toolbar, in the Extension manager UI, and 
  the various extensions app stores
  * a 32px icon will be shown in the toolbar (resized)
  * a 48px icon will be shown in the Firefox Add-ons Manager and Chrome 
  Extensions Management
  * a 96px icon will be shown in the Firefox Add-ons Manager (on high DPI devices 
with a Retina display)
  * a 128px icon will be shown in the Chrome Web Store

To deliver the best visual experience to users with high-resolution displays, 
the browser will attempt to find the best matching resolution icon. It is best 
practice to provide a set of icons in multiple resolutions.

This `manifest.json` defines a minimal browser extension that provides an icon 
but doesn't do anything, but _hey_, its something:

```json
{
  "manifest_version": 2,

  "version": "1.0",

  "name": "My extension",
  "author": "me",

  "description": "My first extension",
 
  "icons": {
    "16":  "icon-16.png",
    "32":  "icon-32.png",
    "48":  "icon-48.png",
    "96":  "icon-96.png"
  }
}
```

Mozilla maintains a [WebExtensions browser compatibility table](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_compatibility_for_manifest.json)
which is helpful for getting the `manifest.json` working across all major 
browsers.


## Extension Runtime Contexts

Access to the complete WebExtensions API is not universally accessible from 
JavaScript. There are different levels of access depending on the context in which
the code is running. There are essentially two contexts: The background context
which has access to the complete WebExtensions API, but cannot access any web
page DOM; and the content script context, which has access to the any web page
DOM API, but doesn't have complete access to the WebExtensions API. The two 
contexts work together with a message passing API that allows them to accomplish
tasks together.

**Background scripts** run in the context of a special hidden tab called 
a background page. This gives them a `window` global containing parts of the
standard DOM API. Background scripts can access _all of the WebExtension 
APIs_ (as long as the `manifest.json` has opted the extension into the necessary 
permissions). Background scripts cannot access the DOM of any web page.

Background scripts _can_ make XHR requests to any hosts (as long as the 
`manifest.json` have granted host permissions). Background scripts do not get 
direct access to web pages, however, they can load content scripts into web 
pages and then can communicate with these content scripts using the 
`browser.runtime.sendMessage` API. The content scripts can then access the web 
page DOM on behalf of the background script.

**Content scripts** are extension-provided scripts which run in the context of a
web page. These scripts can see and manipulate the page DOM, just like normal 
scripts loaded by the page. Unlike normal page scripts, they can also make 
cross-domain XHR requests (when granted permission). Content scripts have access 
to a more restricted  [subset of the overall WebExtensions 
API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#WebExtension_APIs). 
For example, the `browser.cookies` API is not available to content scripts. 
Content scripts can exchange messages with their background scripts, and in this 
way indirectly access all the WebExtension APIs.

Web extension code communicates across contexts using either the standard DOM 
API `window.postMessage(...)`: for communicate between content scripts and other 
scripts on the host page, or the content scripts and other page scripts can 
communicate with the background script using the 
`browser.runtime.sendMessage(...)` API. The background script can additionally 
send messages to the content script using `browser.tabs.sendMessage(...)`.

![extension message communication](static/images/2019-03-08-communication.png)


## Deploying an extension

Extensions are compressed into a zip file before being uploaded to the extension 
app store. Mozilla maintains a build tool for creating a zipped package that'll 
work on both the Chrome Web Store and the Firefox Addons store. This tool can 
also perform project linting, as well as testing and a development runner that 
hot-reloads extension code for Firefox.

* [web-ext](https://github.com/mozilla/web-ext/)
* [Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext)


## Resources

* [Google WebExtensions API](https://developer.chrome.com/extensions)
* [Mozilla WebExtensions API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions)
* [Brave](https://github.com/brave/browser-laptop/wiki/Developer-Notes-on-Installing-or-Updating-Extensions)
* [Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/platform/documentation/extensions/)

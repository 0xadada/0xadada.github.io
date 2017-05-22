---
layout: long
title: "Approaches for Pushing Do Not Track to the edges"
displayTitle: "Approaches for Pushing Do-Not-Track to the edges"
date: 2015-03-31 20:01:00
metaDescription: "Do Not Track (DNT) is dying a slow death, but we can take some simple steps to encourage its wider adoption."
metaOgType: "article"
metaImage: /static/images/2015-03-31-dnt-firefox.png
author: Ron. A
license: cc-by-nc-sa
---

Lets face it, Do Not Track (DNT) is dying a slow death. Content providers
are either ignoring the setting, or giving lip service to DNT while
taking no action behind the scenes.

Worse yet, if users are able to find the browser preference, they don’t
understand its purpose or value. Enabling the feature is confusing, and
quite inconsistent between browser vendors.

Goggle Chrome hides the feature behind an “Advanced” barrier. Features and
settings are typically placed behind this type of barrier when the feature
could cause problems for novice users, or as a catch-all for rarely used
features. Features labelled “Advanced” intimidate many users from
activation.

Chrome labels the feature: Send a “Do Not Track” request with your browsing
traffic which is misleading; an additional request is not sent, instead a
header is included in requests made to the server.

Chrome further discourages activation with a confirmation dialog containing
a wall of legalese when the user clicks the check box.
[see video illustration](http://gfycat.com/BeautifulInfiniteKob)

<figure>
  <img src="/static/images/2015-03-31-dnt-chrome.png"
    alt="Google Chrome settings panel" title="Google Chrome settings panel">
  <figcaption>
    Google Chrome hides the Do Not Track feature behind a wall of legalese
  </figcaption>
</figure>

Mozilla Firefox features the DNT setting more prominently at the top of
the Privacy tab. While the wording is simple and clear, it offers little
contextual explanation, and provides no incentives to encourage
activation.

<figure>
  <img src="/static/images/2015-03-31-dnt-firefox.png"
    alt="Google Chrome settings panel" title="Google Chrome settings panel">
  <figcaption>Firefox provides no incentives to activate the DNT
    feature.
  </figcaption>
</figure>

Apple Safari is the most confusing, it labels the DNT feature with the
text “Website tracking” followed by a check box. This construction misleads
users into thinking that enabling the feature will act as an explicit
opt-in to website tracking. Ask websites not to track me is a request to
opt-in to a negative; this requires a moment of mental aerobics many
users trip over.

This of course, discourages users from enabling the setting.

<figure>
  <img src="/static/images/2015-03-31-dnt-safari.png"
    alt="Safari settings panel" title="Safari settings panel">
  <figcaption>The Safari setting misleads users into thinking that
    enabling DNT will be an opt-in to website tracking.</figcaption>
</figure>

Microsoft made a bold choice by choosing to enable DNT on by default in Internet Explorer 10. A great example to set, and good for their user privacy. The wording of the feature label could use some clarification however.

Again, the wording here misleads users into thinking that additional requests are made to sites they visit.

<figure>
  <img src="/static/images/2015-03-31-dnt-ie.png"
    alt="IE 10 settings panel" title="IE 10 settings panel">
  <figcaption>Internet Explorer 10 enables DNT by default.</figcaption>
</figure>


### DNT is not a technical problem

At its core, this is a social problem, not a technical problem. There are
four stakeholders involved, all their interests need to be aligned in
order for this project to succeed. The user needs to understand the value
of DNT to their everyday privacy. The browser vendor needs to be
encouraged to implement DNT that best serves their interests: acquiring
& maintaining users, and accommodating content providers.

If DNT is going to succeed, the approach needs to give incentives to both
browser users as well as content providers.

### The Approach

The most effective way to promote the adoption of DNT is to appeal to
peoples emotions.

Lets first consider the appeal to fear. An appeal to fear will result in
web browsers who are afraid of marketing companies building “Shadow
Profiles” behind their backs and black-masked hackers around every corner
looking to steal their identities. An appeal to fear will result in
content-providers fearing the day search engines begin punishing them for
failing to honor DNT.

The alternate approach is to appeal to positive emotions. Highlight the
user benefits of DNT as a browser feature that promotes privacy, while
highlighting the business benefits of DNT to content providers, search
engines and browser vendors.

* Reward users by showcasing what they gain by enabling DNT.
* Reward browser vendors who implement DNT in a user-friendly way.
* Reward content providers that honor DNT with increased search engine
position.
* Reward search providers by increasing or maintaining user return rate

### Users

Users will be empowered when they’re given tools to control their online
privacy. This is initially an emotional feeling when their browser displays
a message in the UI indicating their privacy is more protected, but more
long term it maintains free agency with ones interaction with the web.

### Browser Vendors

Browser vendors will be motivated to increase user acquisition and
maintenance as users switch to the browser with more simple and easy
to-use privacy-centric functionality.

Browser vendors should increase DNT usage by defaulting to ```DNT=1```
when the user enables privacy mode.

### Content Providers

Sites offering pro-DNT content and services will acquire more visits with
higher search engine placement; once Search providers begin rewarding
sites that honor DNT.

### Search Providers

As users migrate to search providers that offer pro-privacy services,
these providers will see an uptick in user acquisition.

There is an emerging privacy market, and those with pro-privacy offerings
will eventually be the ones who win — as marketing surveillance becomes
more ubiquitous and users wise-up to its encroachments on privacy.

---

### Resources

* [Mozilla DNT Usage Metrics Dashboard](https://dnt-dashboard.mozilla.org/)
* [W3C Unofficial Draft Proposal](http://lists.w3.org/Archives/Public/public-tracking/2012Jun/att-0095/compromise-proposal-pde-tl-jm.html)
* [W3C Tracking Preference Expression (DNT)](http://www.w3.org/TR/tracking-dnt/)
* [FTC Comment on DNT](http://donottrack.us/docs/FTC_Privacy_Comment_Stanford.pdf)
* [Do Not Track Field Guide (Mozilla)](https://developer.mozilla.org/en-US/docs/Web/Security/Do_not_track_field_guide)
* [Do Not Track Implementation Cookbook](http://donottrack.us/cookbook/)

#### Thanks

Thanks to [@MickD](https://twitter.com/@mickd) for informing me that
Microsoft IE10 comes with DNT enabled by default.

---

This article was originally published on
[Medium.com](https://medium.com/@0xadada/approaches-for-pushing-do-not-track-to-the-edges-70f0edb2b927)

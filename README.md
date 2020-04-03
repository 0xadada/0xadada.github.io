# https://0xadada.pub

Website for 0xADADA.pub

Site is built with [Jekyll](http://jekyllrb.com) and served with GitHub Pages.

## Requirements

- Ruby 2.0.0+
- Bundle `gem install bundler --user-install`

## Development

```bash
yarn
bundle install
```

After checking out the repo, run `git config core.hooksPath .githooks` to enable
automatic markdown formatting. Alternatively run `yarn format` to manually
format the Markdown files.

To run in development sever:

```bash
bundle exec jekyll serve
```

To live preview markdown in a browser:

```bash
yarn pen <filename>
```

## Layouts

These options are available to any post:

```md
layout: optional, defaults to "default" layout. Others are: longread: full-bleed
text content. webmention-reply: Specific microformat markup for comment replies.
webmention-like: Specific microformat markup for likes.

header: optional, defaults to "header.html". Can specify `false` to disable the
header. webmentions: optional: `false` can disable the webmentions form. footer:
optional, defaults to "footer.html". Can specify `false` to disable the footer.

alternate: an alternate canonical URL, the page automatically redirects to this
URL with a meta tag.

title: Required, the title of the post.

date: Required, format: `YYYY-MM-DD hh:mm:ss`

author: An authors name. Providing one should also be entered in
`_data/authors.yml`.
```

## License

[MIT](LICENSE)

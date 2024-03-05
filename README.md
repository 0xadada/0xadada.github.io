This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Markdown examples

Metadata fields

- `title: string`
- `description: string`
- `image?: string`
- `noindex?: true`
- `tags?: string[]`

Image gallery

```markdown
![Engine intake](/static/images/2015-08-15-raspec-impreza-engine-intake.jpg)
![Engine intercooler](/static/images/2015-08-15-raspec-impreza-engine-intercooler.jpg)
```

Quote

```markdown
> The air traveller only travels after he has landed.
>
> <figcaption>Marshall McLuhan <cite>Understanding Media</cite></figcaption>
```

Bibliography

```
<div className="hanging-indent">

<cite>book 1 </cite>
<cite>book 2 </cite>

</div>
```

Footnote

```
Lorem ipsum[^1] dolor.

[^1]:
    Notes can be
    multiline.
```

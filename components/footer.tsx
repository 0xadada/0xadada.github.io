import Link from 'next/link';
import styles from './footer.module.css';
import layout from './layout.module.css';

function year() {
  const date = new Date();
  return `${date.getFullYear()}`;
}

export default function Footer() {
  return (
    <footer className={`${styles.footer} ${layout.layout}`}>
      <p>
        &copy; 2003-{year()} 0xADADA (unless otherwise noted.)
        <br />
        <Link href="/">
          <a title="0xADADA">Home</a>
        </Link>{' '}
        <Link href="/rss.xml">RSS</Link>{' '}
        <span className="h-card">
          <Link href="mailto:0xadada.pub@protonmail.com">
            <a className="c-Meta u-email" rel="me" title="0xADADA">
              Email
            </a>
          </Link>{' '}
        </span>
        <Link href="https://0xadada.github.io/resume/">
          <a rel="me" title="Ron Adams Resume">
            Resume
          </a>
        </Link>{' '}
        <Link href="https://freeradical.zone/@0xadada">
          <a rel="me nofollow external noopener" title="0xADADA on Mastodon">
            Mastodon
          </a>
        </Link>{' '}
        <Link href="https://twitter.com/0xadada">
          <a rel="me nofollow external noopener" title="0xADADA on Twitter">
            Twitter
          </a>
        </Link>{' '}
        <Link href="https://github.com/0xadada">
          <a rel="me nofollow external noopener" title="0xADADA on GitHub">
            GitHub
          </a>
        </Link>{' '}
        <Link href="https://www.goodreads.com/review/list/60524683-0xadada?shelf=wanted">
          <a rel="me nofollow external noopener" title="0xADADA on Goodreads">
            Goodreads
          </a>
        </Link>{' '}
      </p>
    </footer>
  );
}

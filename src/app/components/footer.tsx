import Link from "next/link";
import Image from "next/image";
import styles from "./footer.module.css";

function year() {
  const date = new Date();
  return `${date.getFullYear()}`;
}

export default function Footer({ className = "" }) {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <nav>
        <p>
          &copy; 2003-{year()} 0xADADA (unless otherwise noted.)
          <br />
          <Link href="/" title="0xADADA">
            Home
          </Link>{" "}
          <span className="h-card">
            <Link
              href="mailto:0xadada.pub@protonmail.com"
              className="c-Meta u-email"
              rel="me"
              title="0xADADA"
            >
              Email
            </Link>{" "}
          </span>
          <Link
            href="https://warpcast.com/0xadada"
            rel="me nofollow external noopener"
            title="0xADADA on Warpcast"
          >
            Farcaster
          </Link>{" "}
          <Link
            href="https://mastodon.cloud/@0xADADA"
            rel="me nofollow external noopener"
            title="0xADADA on Mastodon"
          >
            Mastodon
          </Link>{" "}
          <Link
            href="https://bsky.app/profile/0xadada.bsky.social"
            rel="me nofollow external noopener"
            title="0xADADA on Bluesky"
          >
            Bluesky
          </Link>{" "}
          <Link
            href="https://twitter.com/0xadada"
            rel="me nofollow external noopener"
            title="0xADADA on Twitter"
          >
            Twitter
          </Link>{" "}
          <Link
            href="https://github.com/0xadada"
            rel="me nofollow external noopener"
            title="0xADADA on GitHub"
          >
            GitHub
          </Link>{" "}
          <Link
            href="https://www.goodreads.com/review/list/60524683-0xadada?shelf=wanted"
            rel="me nofollow external noopener"
            title="0xADADA on Goodreads"
          >
            Goodreads
          </Link>{" "}
          <Link href="/rss.xml">RSS</Link>{" "}
          <Image
            src="/static/images/meta/avatar.svg"
            alt="0xADADA icon"
            width="20"
            height="20"
            style={{ marginBottom: "-0.125rem" }}
          />
        </p>
      </nav>
    </footer>
  );
}

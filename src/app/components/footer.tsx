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
          <span className="h-card">
            <span className="p-note" hidden>
              0xADADA is a Software Engineer / Writer / Motorsports Driver
              exploring the impact of the attention economy on idleness, time,
              and lived experience. 🧑‍💻🔧🚗✍️🔒
            </span>
            <Link
              className="u-url u-uid"
              href="https://0xadada.pub/"
              title="0xADADA"
            >
              0xADADA
            </Link>{" "}
            <Link
              href="mailto:0xadada.pub@protonmail.com"
              className="c-Meta u-email"
              rel="me"
              title="0xADADA"
            >
              Email
            </Link>{" "}
            <Link
              href="https://warpcast.com/0xadada"
              className="u-url"
              rel="me nofollow external noopener"
              title="0xADADA on Warpcast"
            >
              Farcaster
            </Link>{" "}
            <Link
              href="https://mastodon.cloud/@0xADADA"
              className="u-url"
              rel="me nofollow external noopener"
              title="0xADADA on Mastodon"
            >
              Mastodon
            </Link>{" "}
            <Link
              href="https://bsky.app/profile/0xadada.bsky.social"
              className="u-url"
              rel="me nofollow external noopener"
              title="0xADADA on Bluesky"
            >
              Bluesky
            </Link>{" "}
            <Link
              href="https://twitter.com/0xadada"
              className="u-url"
              rel="me nofollow external noopener"
              title="0xADADA on Twitter"
            >
              <del>Twitter</del>
            </Link>{" "}
            <Link
              href="https://github.com/0xadada"
              className="u-url"
              rel="me nofollow external noopener"
              title="0xADADA on GitHub"
            >
              GitHub
            </Link>{" "}
            <Link
              href="https://www.goodreads.com/review/list/60524683-0xadada?shelf=wanted"
              className="u-url"
              rel="me nofollow external noopener"
              title="0xADADA on Goodreads"
            >
              Goodreads
            </Link>{" "}
            <Link href="/rss.xml">RSS</Link>{" "}
            <Image
              className="u-photo"
              src="/static/images/meta/avatar.svg"
              alt="0xADADA icon"
              width="20"
              height="20"
              style={{ marginBottom: "-0.125rem" }}
            />
          </span>
        </p>
      </nav>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/0xadada"
        method="post"
        target="popupwindow"
      >
        <label htmlFor="email">
          Sign up to get emailed when I write new things:{" "}
        </label>
        <input type="email" name="email" id="email" />
        <input type="submit" value="Subscribe" />
      </form>
    </footer>
  );
}

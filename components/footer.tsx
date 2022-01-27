import Link from "next/link";
import styles from "./footer.module.css";
import { layout } from "./layout.module.css";
import { SITENAME, BASEURL } from "../lib/constants";

function year() {
  const date = new Date();
  return `${date.getFullYear()}`;
}
export default function Footer() {
  return (
    <footer className={`${styles.footer} ${layout}`}>
      <p>
        &copy; 2003-{year()} 0xADADA (unless otherwise noted.)
        <br />
        <Link href="/" title="0xADADA">
          Home
        </Link>{" "}
        <span className="h-card">
          <Link
            className="c-Meta u-email"
            href="mailto:0xadada.pub@protonmail.com"
            rel="me"
            title="0xADADA"
          >
            Email
          </Link>{" "}
        </span>
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
      </p>
    </footer>
  );
}
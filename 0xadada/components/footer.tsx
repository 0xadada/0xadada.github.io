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
        <a href="/feed.xml" rel="me" title="0xADADA Atom Feed">
          RSS
        </a>{" "}
        <a href="/" title="0xADADA">
          Home
        </a>{" "}
        <span className="h-card">
          <a
            className="c-Meta u-email"
            href="mailto:0xadada.pub@protonmail.com"
            rel="me"
            title="0xADADA"
          >
            Email
          </a>{" "}
          <a
            className="c-Meta fn p-name u-url"
            hidden
            href="https://0xadada.pub"
            rel="me"
            alt="0xADADA"
            title="0xADADA"
          >
            0xADADA
          </a>{" "}
        </span>
        <a
          href="https://twitter.com/0xadada"
          rel="me nofollow external noopener"
          title="0xADADA on Twitter"
        >
          Twitter
        </a>{" "}
        <a
          href="https://github.com/0xadada"
          rel="me nofollow external noopener"
          title="0xADADA on GitHub"
        >
          GitHub
        </a>{" "}
        <a
          href="https://www.goodreads.com/review/list/60524683-0xadada?shelf=wanted"
          rel="me nofollow external noopener"
          title="0xADADA on Goodreads"
        >
          Goodreads
        </a>{" "}
      </p>
    </footer>
  );
}

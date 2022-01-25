import { layout } from "./layout.module.css";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={`${layout} ${styles.header}`}>
      <a className={styles.avatar} href="/" title="0xADADA">
        <span className={styles.avatarLabel}>0xADADA</span>
      </a>
      <nav role="navigation">
        <ul className={styles.items}>
          <li className={styles.item}>
            <a
              className={styles.link}
              href="/2021/03/27/the-society-of-the-spectacle/"
            >
              📕 Book
            </a>
          </li>
          <li className={styles.item}>
            <a className={styles.link} href="/1980/06/05/about/">
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

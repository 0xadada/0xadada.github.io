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
            <a className={styles.link} href="/books/">
              📕 Book
            </a>
          </li>
          <li className={styles.item}>
            <a className={styles.link} href="/essays/">
              Essays
            </a>
          </li>
          <li className={styles.item}>
            <a className={styles.link} href="/notes/">
              Notes
            </a>
          </li>
          <li className={styles.item}>
            <a className={styles.link} href="/about/">
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

import Link from "next/link";
import { layout } from "./layout.module.css";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={`${layout} ${styles.header}`}>
      <Link className={styles.avatar} href="/" title="0xADADA" passHref>
        <span className={styles.avatarLabel}>0xADADA</span>
      </Link>
      <nav role="navigation">
        <ul className={styles.items}>
          <li className={styles.item}>
            <Link
              className={styles.link}
              href="/2021/03/27/the-society-of-the-spectacle/"
            >
              📕 Book
            </Link>
          </li>
          <li className={styles.item}>
            <Link className={styles.link} href="/1980/06/05/about/">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

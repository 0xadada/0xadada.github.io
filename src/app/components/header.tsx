import Link from "next/link";
import styles from "./header.module.css";

export default function Header({ className = "" }) {
  return (
    <header className={styles.header}>
      <Link className={styles.avatar} href="/" title="0xADADA" passHref>
        <span className={styles.avatarLabel}>0xADADA</span>
      </Link>
      <nav role="navigation">
        <ul className={styles.items}>
          <li className={styles.item}>
            <Link
              href="/2021/03/27/the-society-of-the-spectacle/"
              className={styles.link}
            >
              📕 Book
            </Link>
          </li>
          <li className={styles.item}>
            <Link href="pages/" className={styles.link}>
              &hellip;
            </Link>
          </li>
          <li className={styles.item}>
            <Link href="now/" className={styles.link}>
              Now
            </Link>
          </li>
          <li className={styles.item}>
            <Link href="about/" className={styles.link}>
              About{" "}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

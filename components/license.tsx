import styles from './license.module.css';

export default function License({ license }) {
  return (
    <footer className={styles.copyright}>
      This is licensed under a Creative Commons {license} International License
    </footer>
  );
}

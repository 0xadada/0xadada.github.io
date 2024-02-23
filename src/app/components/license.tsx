import styles from "./license.module.css";

interface LicenseProps {
  license?: "cc-by-nc-sa" | "cc-by-sa" | "cc-by";
}

export default function License({ license = "cc-by-nc-sa" }: LicenseProps) {
  return (
    <footer className={styles.copyright}>
      This is licensed under a Creative Commons {license} International License
    </footer>
  );
}

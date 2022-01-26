import styles from "./byline.module.css";

interface AuthorProps {
  author: string;
}

export default function Byline({ author }: AuthorProps) {
  return (
    <span className={`${styles.byline} h-card`}>
      by: <span className="author fn p-author p-name">{author}</span>
    </span>
  );
}

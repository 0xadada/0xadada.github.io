import styles from "./byline.module.css";

export default function Byline({ author }) {
  return (
    <span className={`${styles.byline} h-card`}>
      by:{" "}
      {author.url ? (
        <a className="author fn p-author p-name u-url" href={author.url}>
          {author.name}
        </a>
      ) : (
        <>{author.name}</>
      )}
    </span>
  );
}

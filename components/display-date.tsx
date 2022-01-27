import { format } from "date-fns";
import styles from "./byline.module.css";

const TOKEN = "EEEE LLLL d, yyyy";

export default function DateFormatter({ datetime }) {
  const date = new Date(datetime);
  const displayDate = format(date, TOKEN);
  const dateTime = date.toISOString();
  return (
    <time className={`${styles.published} dt-published`} dateTime={dateTime}>
      {displayDate}
    </time>
  );
}

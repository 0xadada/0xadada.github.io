import { format } from "date-fns";
import styles from "./display-date.module.css";

const TOKEN = "EEEE LLLL d, yyyy";

interface DateFormatterProps {
  datetime: Date;
}

export default function DateFormatter({ datetime }: DateFormatterProps) {
  const date = new Date(datetime);
  const displayDate = format(date, TOKEN);
  const dateTime = date.toISOString();
  return (
    <time className={`${styles.published} dt-published`} dateTime={dateTime}>
      {displayDate}
    </time>
  );
}

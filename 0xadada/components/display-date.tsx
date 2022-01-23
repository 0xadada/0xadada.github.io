import { format } from "date-fns";

const TOKEN = "EEEE LLLL d, yyyy";

export default function DateFormatter({ datetime }) {
  const date = new Date(datetime);
  const displayDate = format(date, TOKEN);
  const dateTime = format(date, "yyyy-MM-dd");
  return <time dateTime={dateTime}>{displayDate}</time>;
}

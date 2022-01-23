import { format } from "date-fns";

const TOKEN = "EEEE LLLL d, yyyy";

export default function DateFormatter({ datetime }) {
  const date = new Date(datetime);
  const displayDate = format(date, TOKEN);
  return <time dateTime={date.toISOString()}>{displayDate}</time>;
}

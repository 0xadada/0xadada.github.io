import { AppProps } from "next/app";
import "../css/base.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

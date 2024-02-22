import type { Metadata } from "next";
import Footer from "./components/footer";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://0xadada.pub"),
  authors: [{ name: "0xADADA", url: "https://0xadada.pub" }],
  alternates: {
    types: {
      "application/rss+xml": "https://0xadada.pub/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body>
        <main className={styles.layout}>{children}</main>
        <Footer className={styles.layout} />
      </body>
    </html>
  );
}

import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom HTML document structure for the entire app.
 * Sets the default language, theme class, and global metadata.
 */
export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <meta
          name="description"
          content="A modern article CMS built with Next.js, React Query, and MongoDB."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

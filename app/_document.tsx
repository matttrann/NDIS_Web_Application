import { Html, Head, Main, NextScript } from "next/document";

export default function MyDocument() {
    return (
        <Html lang="en">
            <Head>
                <link rel="manifest" href="/manifest_and_icons/manifest.json" />
                <link rel="apple-touch-icon" href="/manifest_and_icons/icon.png" />
                <meta name="theme-color" content="#fff" />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}

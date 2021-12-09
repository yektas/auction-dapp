import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html data-theme="dark" className="bg-gray-900 ">
        <Head />
        {/*<body className="h-full bg-gradient-to-tl from-emerald-500 via-emerald-300 to-cyan-400">*/}
        <body>
          {/* <body className="h-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500"> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

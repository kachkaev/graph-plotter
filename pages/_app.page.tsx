import "normalize.css/normalize.css";

import type { AppProps } from "next/app";
import * as React from "react";

import { GlobalStyle } from "../shared/global-style";

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    document.body.className = document.body.className.replace("no-js", "js");
  }, []);

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}

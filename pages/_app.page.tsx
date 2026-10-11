import "normalize.css/normalize.css";

import type { AppProps } from "next/app";
import * as React from "react";
import { I18nextProvider } from "react-i18next";

import { GlobalStyle } from "../shared/global-style";
import { i18next } from "../shared/i18n";

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    document.body.className = document.body.className.replace("no-js", "js");
  }, []);

  // Pages like 404 use the default language, /vk overrides it with its own provider
  return (
    <I18nextProvider i18n={i18next}>
      <GlobalStyle />
      <Component {...pageProps} />
    </I18nextProvider>
  );
}

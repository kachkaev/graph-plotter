import { AppProps } from "next/app";
import React from "react";

import { GlobalStyle } from "../ui/shared/GlobalStyle";

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    document.body.className = (document.body.className ?? "").replace(
      "no-js",
      "js",
    );
  }, []);

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
};

export default App;

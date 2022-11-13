import { AppProps } from "next/app";
import * as React from "react";

import { GlobalStyle } from "../shared/global-style";

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    document.body.className = document.body.className.replace("no-js", "js");
  }, []);

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
};

export default App;

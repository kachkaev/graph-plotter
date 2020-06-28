import { createGlobalStyle, css } from "styled-components";
import normalize from "styled-normalize";

const base = css`
  body {
    color: #24292e;
    font-family: -apple-system, BlinkMacSystemFont, Roboto, Open Sans,
      Helvetica Neue, "Noto Sans Armenian", "Noto Sans Bengali",
      "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic",
      "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada",
      "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil",
      "Noto Sans Telugu", "Noto Sans Thai", sans-serif;
    margin: 0;
    line-height: 160%;
    font-size: 13px;
    background: #edeef0;
  }

  html,
  body {
    height: 100%;
  }

  #__next {
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  a {
    color: #2a5885;
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  ${base}
`;

import { createGlobalStyle, css } from "styled-components";
import normalize from "styled-normalize";

const base = css`
  :root {
    --link-color: #2a5885;
    --background-color: #edeef0;
  }
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
    background: var(--background-color);
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
    color: var(--link-color);
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }
  }

  button {
    padding: 1px 6px;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  ${base}
`;

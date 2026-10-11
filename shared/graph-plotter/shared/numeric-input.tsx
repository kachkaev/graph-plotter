import { styled } from "styled-components";

import { Input } from "./input";

export const NumericInput = styled(Input).attrs({ textAlign: "right" })`
  width: 60px;

  :focus {
    outline: none;
  }
`;

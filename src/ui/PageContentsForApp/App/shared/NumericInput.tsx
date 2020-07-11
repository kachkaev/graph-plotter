import styled from "styled-components";

import { Input } from "./Input";

export const NumericInput = styled(Input)`
  width: 60px;

  :focus {
    outline: none;
  }
`;

NumericInput.defaultProps = {
  textAlign: "right",
};

import * as React from "react";
import styled from "styled-components";

import { App } from "./App";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const PageContentsForApp: React.FunctionComponent = () => {
  return (
    <Wrapper>
      <App width={780} height={570} />
    </Wrapper>
  );
};

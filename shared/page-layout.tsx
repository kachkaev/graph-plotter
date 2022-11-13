import * as React from "react";
import styled from "styled-components";

import { GlobalStyle } from "./global-style";

const Container = styled.div`
  margin: 0 auto;
  padding: 0 20px 50px;
  position: relative;
  max-width: 35em;
  min-width: 270px;
`;

const TopSection = styled.div`
  padding: 80px 0 40px;

  @media (max-width: 700px) {
    padding: 40px 0 20px;
  }

  @media (max-width: 550px) {
    padding: 10px 0 0px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 48px;
  line-height: 1.4em;
  text-align: center;
`;
const Description = styled.div`
  font-weight: bold;
  text-align: center;
`;

const ExternalLinks = styled.div`
  margin: 10px auto 0;
  text-align: center;
  & > * {
    margin: 0 8px;
  }
`;

export const PageLayout: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <Container>
      <GlobalStyle />
      <TopSection>
        <Title>Graph plotter</Title>
        <Description>Web app to plot function graphs</Description>
        <ExternalLinks>
          <a href="https://github.com/graph-plotter/graph-plotter">
            github repo
          </a>
        </ExternalLinks>
        {children}
      </TopSection>
    </Container>
  );
};

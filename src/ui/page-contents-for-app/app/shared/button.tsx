import styled from "styled-components";

export const Button = styled.button<{ secondary?: boolean }>`
  position: relative;
  background: ${(props) => (props.secondary ? "#dedede" : "var(--link-color)")};
  color: ${(props) => (props.secondary ? "#000" : "#f3f3f3")};
  border: none;
  border-radius: 4px;
  padding: 5px 12px;

  :active {
    transform: translate(0px, 1px);
  }

  :focus {
    outline: none;
  }
`;

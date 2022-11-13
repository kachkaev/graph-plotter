import * as React from "react";
import styled from "styled-components";

import { transparentColor } from "../../shared/available-colors";

const Square = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
`;

const Frame = styled.div`
  position: absolute;
  z-index: 15;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 2px solid red;
`;

const DiagonalLine = styled.div`
  position: absolute;
  top: -50%;
  left: 50%;
  width: 2px;
  height: 38px;
  background: red;
  transform: rotate(45deg);
  transform-origin: center center;
`;

export type SwatchSelectCallback = (color: string) => void;

export interface SwatchProps {
  value: string;
  selected: boolean;
  onSelect: SwatchSelectCallback;
}

export const Swatch: React.FunctionComponent<SwatchProps> = ({
  value,
  selected,
  onSelect,
}) => {
  const handleClick = React.useCallback(() => {
    onSelect?.(value);
  }, [onSelect, value]);

  const transparent = value === transparentColor;

  return (
    <Square
      onClick={handleClick}
      style={{ backgroundColor: transparent ? "#fff" : value }}
    >
      {selected ? <Frame /> : undefined}
      {transparent ? <DiagonalLine /> : undefined}
    </Square>
  );
};

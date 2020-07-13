import React from "react";
import styled from "styled-components";

const availableColors = [
  "#2a5885",
  // "#1f78b4",
  "#a6cee3",
  "#33a02c",
  "#b2df8a",
  "#e31a1c",
  "#fb9a99",
  "#ff7f00",
  "#fdbf6f",
  "#6a3d9a",
  "#cab2d6",
];

const Wrapper = styled.button`
  background: none;
  width: 10px;
  display: flex;
  padding: 0;
  align-items: center;
  align-content: center;
  border: none;
  height: 1em;

  ${(p) =>
    p.disabled
      ? "pointer-events: none;"
      : `
  :active {
    transform: translate(0px, 1px);
  }
  `};

  :focus {
    outline: none;
  }
`;

const Indicator = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 10px;
`;

export interface ColorPickerProps {
  disabled?: boolean;
  value: string;
  onChange?: (newValue: string) => void;
}

export const ColorPicker: React.FunctionComponent<ColorPickerProps> = ({
  disabled,
  value,
  onChange,
}) => {
  const handleWrapperClick = React.useCallback(() => {
    const currentColorIndex = availableColors.indexOf(value);
    onChange?.(
      availableColors[(currentColorIndex + 1) % availableColors.length],
    );
  }, [onChange, value]);

  return (
    <Wrapper onClick={handleWrapperClick} disabled={disabled}>
      <Indicator style={{ background: value }} />
    </Wrapper>
  );
};

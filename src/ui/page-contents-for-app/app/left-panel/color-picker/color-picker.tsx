import * as React from "react";
import styled from "styled-components";

import {
  availableColors,
  transparentColor,
} from "../../shared/available-colors";
import { Swatch, SwatchSelectCallback } from "./swatch";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  padding: 0 0 2px;
  height: 1em;
  align-items: center;
  align-content: center;
  width: 10px;
`;

const Toggler = styled.button<{ disabled?: boolean }>`
  padding: 5px;
  margin: -5px;
  background: none;
  border: none;
  ${(props) =>
    props.disabled
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

const Swatches = styled.div<{ toggled: boolean }>`
  display: block;
  white-space: nowrap;
  position: absolute;
  left: 100%;
  top: -2px;
  bottom: -3px;
  overflow: hidden;
  width: ${(props) =>
    props.toggled ? (availableColors.length + 1) * 20 : 0}px;
  transition: all 0.3s;
  z-index: 10;
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
  const [toggled, toggle] = React.useState(false);

  React.useEffect(() => {
    if (disabled) {
      toggle(false);
    }
  }, [disabled]);

  const handleWrapperClick = React.useCallback<React.MouseEventHandler>(() => {
    toggle((oldVisible) => !oldVisible);
  }, []);

  const handleSwatchSelect = React.useCallback<SwatchSelectCallback>(
    (color) => {
      toggle(false);
      onChange?.(color);
    },
    [onChange],
  );

  return (
    <Wrapper>
      <Toggler onClick={handleWrapperClick}>
        <Indicator style={{ background: value }} />
      </Toggler>
      <Swatches toggled={!disabled && toggled}>
        <Swatch
          value={transparentColor}
          selected={value === transparentColor}
          onSelect={handleSwatchSelect}
        />
        {availableColors.map((color) => (
          <Swatch
            value={color}
            key={color}
            selected={value === color}
            onSelect={handleSwatchSelect}
          />
        ))}
      </Swatches>
    </Wrapper>
  );
};

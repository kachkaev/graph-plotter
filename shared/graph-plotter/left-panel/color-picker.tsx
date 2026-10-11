import * as React from "react";
import { styled } from "styled-components";

import { availableColors, transparentColor } from "../shared/available-colors";
import { Swatch, type SwatchSelectCallback } from "./color-picker/swatch";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  padding: 0 0 2px;
  height: 1em;
  align-items: center;
  align-content: center;
  width: 10px;
`;

const Toggler = styled.button`
  padding: 5px;
  margin: -5px;
  background: none;
  border: none;

  :active {
    transform: translate(0px, 1px);
  }

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

const Swatches = styled.div<{ $toggled: boolean }>`
  display: block;
  white-space: nowrap;
  position: absolute;
  left: 100%;
  top: -2px;
  bottom: -3px;
  overflow: hidden;
  width: ${(props) =>
    props.$toggled ? (availableColors.length + 1) * 20 : 0}px;
  transition: all 0.3s;
  z-index: 10;
`;

export type ColorPickerProps = {
  disabled?: boolean | undefined;
  value: string;
  onChange?: ((newValue: string) => void) | undefined;
};

export function ColorPicker({ disabled, value, onChange }: ColorPickerProps) {
  const [toggled, setToggled] = React.useState(false);

  // Close the swatches as soon as the picker becomes disabled (state adjustment during render,
  // see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  const [previousDisabled, setPreviousDisabled] = React.useState(disabled);
  if (previousDisabled !== disabled) {
    setPreviousDisabled(disabled);
    if (disabled) {
      setToggled(false);
    }
  }

  const handleWrapperClick = React.useCallback<React.MouseEventHandler>(() => {
    setToggled((oldVisible) => !oldVisible);
  }, []);

  const handleSwatchSelect = React.useCallback<SwatchSelectCallback>(
    (color) => {
      setToggled(false);
      onChange?.(color);
    },
    [onChange],
  );

  return (
    <Wrapper>
      <Toggler onClick={handleWrapperClick}>
        <Indicator style={{ background: value }} />
      </Toggler>
      <Swatches $toggled={!disabled && toggled}>
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
}

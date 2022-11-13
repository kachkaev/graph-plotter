import * as React from "react";
import styled from "styled-components";

// https://www.iconfinder.com/icons/326561/box_check_icon
// https://www.iconfinder.com/icons/326558/blank_box_check_icon

export const CheckedIcon: React.FunctionComponent<
  React.HTMLAttributes<SVGElement> & { checked: boolean }
> = ({ checked, ...rest }) => {
  return (
    <svg viewBox="0 0 18 18" {...rest}>
      {checked ? (
        <path
          fill="currentColor"
          d="M4.9,7.1 L3.5,8.5 L8,13 L18,3 L16.6,1.6 L8,10.2 L4.9,7.1 L4.9,7.1 Z M16,16 L2,16 L2,2 L12,2 L12,0 L2,0 C0.9,0 0,0.9 0,2 L0,16 C0,17.1 0.9,18 2,18 L16,18 C17.1,18 18,17.1 18,16 L18,8 L16,8 L16,16 L16,16 Z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M16,2 L16,16 L2,16 L2,2 L16,2 L16,2 Z M16,0 L2,0 C0.9,0 0,0.9 0,2 L0,16 C0,17.1 0.9,18 2,18 L16,18 C17.1,18 18,17.1 18,16 L18,2 C18,0.9 17.1,0 16,0 L16,0 L16,0 Z"
        />
      )}
    </svg>
  );
};

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  children: React.ReactNode;
}

const CheckboxWrapper = styled.span<{ isChecked: boolean }>`
  white-space: nowrap;
  position: relative;
  display: block;
  background: no-repeat 2px 2px;
  background-size: 1em;
`;

const Input = styled.input`
  position: absolute;
  left: -10000px;
`;

const StyledCheckIcon = styled(CheckedIcon)`
  position: absolute;
  pointer-events: none;
  width: 12px;
  top: 4px;
  left: 0;
`;

const Label = styled.label`
  padding-left: 1.5em;
  user-select: none;
  .no-touchscreen &:hover {
    color: #000;
  }
`;

export const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  children,
  ref,
  as,
  ...rest
}) => {
  return (
    <CheckboxWrapper isChecked={Boolean(rest.checked)}>
      <Input type="checkbox" {...rest} />
      <Label htmlFor={rest.id}>
        <StyledCheckIcon checked={Boolean(rest.checked)} />
        {children}
      </Label>
    </CheckboxWrapper>
  );
};

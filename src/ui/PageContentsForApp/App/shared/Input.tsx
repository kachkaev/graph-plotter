import React from "react";
import styled from "styled-components";

export type InputStatus = "modified" | "error";

const Wrapper = styled.div<{ status?: InputStatus }>`
  position: relative;
  height: 24px;
  vertical-align: baseline;
  display: flex;
  padding: 0 3px;
  border: 1px solid;
  border-color: ${(p) => (p.status === "error" ? "#dd9e8c" : "#cacaca")};
  background: ${(p) =>
    p.status === "error"
      ? "#fcefe9"
      : p.status === "modified"
      ? "#fffeb4"
      : "#fff"};
  box-sizing: border-box;
`;

const InputControl = styled.input`
  min-width: 0;
  padding: 0;
  text-align: right;
  background: transparent;
  border: none;
  flex-grow: 1;

  :focus {
    outline: none;
  }
`;

const Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  {
    value: string;
    status?: InputStatus;
    onChange?: (newValue: string) => void;
    onSubmit?: () => void;
    name?: string;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">
> = ({ value, onChange, onSubmit, name, ...rest }, ref) => {
  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      onChange?.(event.target.value);
    },
    [onChange],
  );

  const handleKeyPress = React.useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    (event) => {
      if (event.key === "Enter") {
        onSubmit?.();
      }
    },
    [onSubmit],
  );

  return (
    <Wrapper {...rest} ref={ref}>
      <InputControl
        name={name}
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </Wrapper>
  );
};

const WrappedInput = React.forwardRef(Input);
export { WrappedInput as Input };

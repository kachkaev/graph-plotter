import * as React from "react";
import styled from "styled-components";

export type InputStatus = "modified" | "error";
export type InputTextAlign = "left" | "right";

const Wrapper = styled.div<{ status?: InputStatus }>`
  position: relative;
  height: 24px;
  vertical-align: baseline;
  display: flex;
  padding: 0 5px;
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

const Prefix = styled.span`
  display: inline-block;
  white-space: pre;
  flex-grow: 0;
  padding: 0;
  line-height: 1.7;
`;

const InputControl = styled.input<{ textAlign: InputTextAlign }>`
  min-width: 0;
  text-align: ${(p) => p.textAlign};
  background: transparent;
  border: none;
  flex-grow: 1;
  padding: 0;
  line-height: 1.5;

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
    textAlign?: InputTextAlign;
    prefix?: string;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">
> = (
  { value, onChange, onSubmit, name, prefix, textAlign = "left", ...rest },
  ref,
) => {
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
      {prefix ? <Prefix>{prefix}</Prefix> : null}
      <InputControl
        name={name}
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        textAlign={textAlign}
      />
    </Wrapper>
  );
};

const WrappedInput = React.forwardRef(Input);
export { WrappedInput as Input };

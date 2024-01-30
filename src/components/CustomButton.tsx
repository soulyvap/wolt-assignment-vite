import { useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";

interface CustomButtonProps extends AriaButtonProps {
  className?: string;
  dataTestId: string;
}

const CustomButton = (props: CustomButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={props.className}
      data-testid={props.dataTestId}
    >
      {props.children}
    </button>
  );
};

export default CustomButton;

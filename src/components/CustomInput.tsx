import { useRef } from "react";
import { AriaTextFieldProps, useTextField } from "react-aria";

/**
 * Custom input props
 * @param label - HtmlInput label
 * @param name - HtmlInput name
 * @param type - HtmlInput type
 * @param value - HtmlInput value
 * @param trailingText - trailing text to be displayed after input e.g. €
 * @param errorMsg - error message shown when form submitted and input is invalid
 * @param dataTestId - data test id for testing
 * @param onChange - on change handler
 */
interface CustomInputProps extends AriaTextFieldProps {
  step?: number;
  min?: number;
  trailingText?: string;
  errorMsg?: string;
  dataTestId: string;
}

/**
 * Custom styled input component
 */
const CustomInput = (props: CustomInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const {
    labelProps,
    inputProps,
    errorMessageProps,
    isInvalid,
    validationErrors,
  } = useTextField(props, ref);
  return (
    <div className="w-full flex flex-row items-start gap-4">
      <label
        {...labelProps}
        className="w-1/3 text-wrap h-9 flex flex-row items-center"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <div className="w-[60%] flex flex-col">
        <input
          {...inputProps}
          className="styled-input w-full"
          ref={ref}
          data-test-id={props.dataTestId}
          data-testid={props.dataTestId}
          step={props.step}
          min={props.min}
        />
        {isInvalid && (
          <div {...errorMessageProps} className="text-red-600 text-sm">
            {validationErrors.join(" ")}
          </div>
        )}
      </div>

      <div className="w-1/12 h-9 flex flex-row justify-center items-center">
        {props.trailingText != undefined && props.trailingText}
      </div>
    </div>
  );
};

export default CustomInput;

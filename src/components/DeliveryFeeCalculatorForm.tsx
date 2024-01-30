import { FormEvent } from "react";
import CustomInput from "./CustomInput.tsx";
import { useDeliveryFeeCalculator } from "../hooks/useDeliveryFeeCalculator.ts";
import { DeliveryFeeCalculatorValues } from "../types/DeliveryFeeCalculatorValues.ts";
import useForm from "../hooks/useForm.ts";
import ThreeDotsAnimation from "./ThreeDotsAnimation.tsx";
import CustomButton from "./CustomButton.tsx";

/**
 * Delivery fee calculator form component
 */
const DeliveryFeeCalculatorForm = () => {
  const { calculateDeliveryFee, getDateTimeString } =
    useDeliveryFeeCalculator();

  const { values, reset, handleValueChange } =
    useForm<DeliveryFeeCalculatorValues>({
      cartValue: undefined,
      distance: undefined,
      itemCount: undefined,
      orderTime: getDateTimeString(new Date()),
      fee: undefined,
    });

  const { cartValue, distance, itemCount, orderTime, fee } = values;

  /**
   * Checks if user is filling form
   * @returns true if user is filling form
   */
  const userIsFillingForm = () =>
    cartValue != undefined || distance != undefined || itemCount != undefined;

  /**
   * Calculates delivery fee and updates fee value on form submit
   * @param event form submit event
   */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = calculateDeliveryFee(values);
    handleValueChange("fee", result);
  };

  /**
   * Resets form to initial values
   * @param event button click event
   */
  const onReset = () => {
    reset();
  };

  return (
    <form className="styled-form" name="calculator-form" onSubmit={onSubmit}>
      <h1
        className="mb-6 grow flex flex-row items-center text-4xl sm:text-3xl sm:grow-0"
        data-testid="form-heading"
      >
        Wolt Delivery Fee Calculator
      </h1>

      <CustomInput
        label={"Cart value"}
        type="number"
        step={0.01}
        min={0.01}
        value={cartValue || ""}
        dataTestId={"cartValue"}
        onChange={(value) => {
          console.log(value);
          handleValueChange("cartValue", value);
        }}
        trailingText={"€"}
        isRequired={true}
        validationBehavior="native"
        placeholder="e.g. 10,50"
      />
      <CustomInput
        label={"Delivery distance"}
        name={"deliveryDistance"}
        type="number"
        min={0}
        value={distance || ""}
        dataTestId={"deliveryDistance"}
        onChange={(value) => handleValueChange("distance", value)}
        trailingText={"m"}
        isRequired={true}
        validationBehavior="native"
        placeholder="e.g. 500"
      />
      <CustomInput
        label={"Number of items"}
        type="number"
        min={1}
        value={itemCount || ""}
        dataTestId={"numberOfItems"}
        onChange={(value) => handleValueChange("itemCount", value)}
        isRequired={true}
        validationBehavior="native"
        placeholder="e.g. 4"
      />
      <CustomInput
        label={"Order time"}
        type="datetime-local"
        value={orderTime}
        dataTestId={"orderTime"}
        onChange={(value) => handleValueChange("orderTime", value)}
        isRequired={true}
        validationBehavior="native"
        pattern="/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/"
      />

      <div className="w-full flex flex-row gap-6 my-6">
        <CustomButton
          className="styled-button"
          type="submit"
          dataTestId="submit-button"
        >
          Calculate delivery fee
        </CustomButton>
        <CustomButton
          className="styled-button bg-yellow-400"
          onPress={onReset}
          dataTestId="reset-button"
        >
          Reset form
        </CustomButton>
      </div>

      <div className="w-full h-6 flex flex-row items-center">
        <label
          id="fee-label"
          className="w-full flex flex-row items-baseline gap-6 text-2xl font-semibold"
        >
          Delivery fee
          {fee != undefined ? (
            <p
              aria-labelledby="fee-label"
              className="text-wolt-blue text-3xl font-bold"
              id="fee"
            >
              <span data-testid="fee" data-test-id="fee">
                {fee.toLocaleString("fi-FI", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              €
            </p>
          ) : (
            <ThreeDotsAnimation animate={userIsFillingForm()} />
          )}
        </label>
      </div>
    </form>
  );
};

export default DeliveryFeeCalculatorForm;

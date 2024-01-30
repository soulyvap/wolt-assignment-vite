import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DeliveryFeeCalculatorForm from "./DeliveryFeeCalculatorForm";

describe("DeliveryFeeCalculatorForm component", () => {
  it("should render", () => {
    render(<DeliveryFeeCalculatorForm />);

    const form = screen.getByRole("form");
    expect(form).toBeDefined();

    const heading = screen.getByTestId("form-heading");
    expect(heading).toBeDefined();

    const cartValueInput = screen.getByLabelText("Cart value");
    expect(cartValueInput).toBeDefined();

    const distanceInput = screen.getByLabelText("Delivery distance");
    expect(distanceInput).toBeDefined();

    const itemCountInput = screen.getByLabelText("Number of items");
    expect(itemCountInput).toBeDefined();

    const orderTimeInput = screen.getByLabelText("Order time");
    expect(orderTimeInput).toBeDefined();

    const submitButton = screen.getByRole("button", {
      name: "Calculate delivery fee",
    });
    expect(submitButton).toBeDefined();

    const resetButton = screen.getByRole("button", { name: "Reset form" });
    expect(resetButton).toBeDefined();
  });

  it("should update cart value input when the input is a valid positive number", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    fireEvent.change(cartValueInput, { target: { value: "10" } });
    expect(cartValueInput.value).toBe("10");
  });

  it("should not update cart value input when the input is a character or 0", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;

    // Character
    fireEvent.change(cartValueInput, { target: { value: "A" } });
    expect(cartValueInput.value).toBe("");

    // 0
    fireEvent.change(cartValueInput, { target: { value: "0" } });
    expect(cartValueInput.value).toBe("0");
  });

  it("cart value input should be invalid upon submission if its value is empty, negative or not a number and no delivery fee should be displayed", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");
    const deliveryFeeLabel = screen.queryByLabelText("fee");
    expect(deliveryFeeLabel).toBeNull();

    // Empty value
    fireEvent.click(submitButton);
    expect(cartValueInput.ariaInvalid).toBeTruthy();

    // Negative value
    fireEvent.change(cartValueInput, { target: { value: "-10" } });
    fireEvent.click(submitButton);
    expect(cartValueInput.ariaInvalid).toBeTruthy();
    expect(deliveryFeeLabel).toBeNull();

    // Not a number
    fireEvent.change(cartValueInput, { target: { value: "e" } });
    fireEvent.click(submitButton);
    expect(cartValueInput.ariaInvalid).toBeTruthy();
    expect(deliveryFeeLabel).toBeNull();
  });

  it("order time input should be invalid upon submission if its value is not a string in the format YYYY-MM-DDTHH:MM", () => {
    render(<DeliveryFeeCalculatorForm />);
    const orderTimeInput = screen.getByTestId("orderTime") as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(orderTimeInput, { target: { value: "hello" } });
    fireEvent.click(submitButton);
    expect(orderTimeInput.ariaInvalid).toBeTruthy();
  });

  it("should display the correct delivery fee only after submitting valid inputs", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    const distanceInput = screen.getByTestId(
      "deliveryDistance"
    ) as HTMLInputElement;
    const itemCountInput = screen.getByLabelText(
      "Number of items"
    ) as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");
    const deliveryFeeLabel = screen.queryByLabelText("fee");

    // Empty form values - no delivery fee
    expect(deliveryFeeLabel).toBeNull();

    fireEvent.change(cartValueInput, { target: { value: "2" } });
    fireEvent.change(distanceInput, { target: { value: "500" } });
    fireEvent.change(itemCountInput, { target: { value: "1" } });
    fireEvent.click(submitButton);

    // Valid form values
    expect(deliveryFeeLabel).toBeDefined();
  });

  it("should display a fee of 0.00 if cartValue is equal to 200", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    const distanceInput = screen.getByTestId(
      "deliveryDistance"
    ) as HTMLInputElement;
    const itemCountInput = screen.getByLabelText(
      "Number of items"
    ) as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");

    // Cart value of 200
    fireEvent.change(cartValueInput, { target: { value: "200" } });
    fireEvent.change(distanceInput, { target: { value: "500" } });
    fireEvent.change(itemCountInput, { target: { value: "1" } });
    fireEvent.click(submitButton);

    const fee = screen.getByTestId("fee");
    expect(fee.textContent).toBe("0,00");
  });

  it("should display a fee of 15.00 at most", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    const distanceInput = screen.getByTestId(
      "deliveryDistance"
    ) as HTMLInputElement;
    const itemCountInput = screen.getByLabelText(
      "Number of items"
    ) as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");

    // Maximizing cost
    fireEvent.change(cartValueInput, { target: { value: "1" } });
    fireEvent.change(distanceInput, { target: { value: "5000" } });
    fireEvent.change(itemCountInput, { target: { value: "1000" } });
    fireEvent.click(submitButton);

    const fee = screen.getByTestId("fee");
    expect(fee.textContent).toBe("15,00");
  });

  it("should display a fee of 10.00 for a cart value of 2, a distance of 500 m, and a number of items of 1, when not in a Friday rush", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    const distanceInput = screen.getByTestId(
      "deliveryDistance"
    ) as HTMLInputElement;
    const itemCountInput = screen.getByTestId(
      "numberOfItems"
    ) as HTMLInputElement;
    const orderTime = screen.getByTestId("orderTime") as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");

    // cart value of 2, distance of 500 m, number of items of 1, not in a Friday rush (thurday)
    fireEvent.change(cartValueInput, { target: { value: "2" } });
    fireEvent.change(distanceInput, { target: { value: "500" } });
    fireEvent.change(itemCountInput, { target: { value: "1" } });
    fireEvent.change(orderTime, { target: { value: "2024-01-25T17:00" } });
    fireEvent.click(submitButton);

    const fee = screen.getByTestId("fee");
    expect(fee.textContent).toBe("10,00");
  });

  it("should display a fee of 12.00 for a cart value of 2, a distance of 500 m, and a number of items of 1, when in a Friday rush", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    const distanceInput = screen.getByTestId(
      "deliveryDistance"
    ) as HTMLInputElement;
    const itemCountInput = screen.getByTestId(
      "numberOfItems"
    ) as HTMLInputElement;
    const orderTime = screen.getByTestId("orderTime") as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");

    // cart value of 2, distance of 500 m, number of items of 1, not in a Friday rush (thurday)
    fireEvent.change(cartValueInput, { target: { value: "2" } });
    fireEvent.change(distanceInput, { target: { value: "500" } });
    fireEvent.change(itemCountInput, { target: { value: "1" } });
    fireEvent.change(orderTime, { target: { value: "2024-01-26T17:00" } });
    fireEvent.click(submitButton);

    const fee = screen.getByTestId("fee");
    expect(fee.textContent).toBe("12,00");
  });

  it("should reset form values", () => {
    render(<DeliveryFeeCalculatorForm />);

    const cartValueInput = screen.getByTestId("cartValue") as HTMLInputElement;
    const distanceInput = screen.getByTestId(
      "deliveryDistance"
    ) as HTMLInputElement;
    const itemCountInput = screen.getByLabelText(
      "Number of items"
    ) as HTMLInputElement;
    const reset = screen.getByTestId("reset-button");
    const deliveryFeeLabel = screen.queryByLabelText("fee");

    // Setting values to form inputs
    fireEvent.change(cartValueInput, { target: { value: "2" } });
    fireEvent.change(distanceInput, { target: { value: "500" } });
    fireEvent.change(itemCountInput, { target: { value: "1" } });

    expect(cartValueInput.value).toBe("2");
    expect(distanceInput.value).toBe("500");
    expect(cartValueInput.value).toBe("2");

    // Resetting form
    fireEvent.click(reset);

    // Form values should be empty
    expect(cartValueInput.value).toBe("");
    expect(distanceInput.value).toBe("");
    expect(cartValueInput.value).toBe("");
    expect(deliveryFeeLabel).toBeNull();
  });
});

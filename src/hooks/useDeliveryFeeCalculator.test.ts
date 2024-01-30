import { renderHook } from "@testing-library/react-hooks";
import { describe, expect, it } from "vitest";
import { useDeliveryFeeCalculator } from "./useDeliveryFeeCalculator";
import { DeliveryFeeCalculatorValues } from "../types/DeliveryFeeCalculatorValues";


/**
 * Rules for calculating a delivery fee
 * If the cart value is less than 10€, a small order surcharge is added to the delivery price. The surcharge is the difference between the cart value and 10€. For example if the cart value is 8.90€, the surcharge will be 1.10€.
 * A delivery fee for the first 1000 meters (=1km) is 2€. If the delivery distance is longer than that, 1€ is added for every additional 500 meters that the courier needs to travel before reaching the destination. Even if the distance would be shorter than 500 meters, the minimum fee is always 1€.
 * Example 1: If the delivery distance is 1499 meters, the delivery fee is: 2€ base fee + 1€ for the additional 500 m => 3€
 * Example 2: If the delivery distance is 1500 meters, the delivery fee is: 2€ base fee + 1€ for the additional 500 m => 3€
 * Example 3: If the delivery distance is 1501 meters, the delivery fee is: 2€ base fee + 1€ for the first 500 m + 1€ for the second 500 m => 4€
 * If the number of items is five or more, an additional 50 cent surcharge is added for each item above and including the fifth item. An extra "bulk" fee applies for more than 12 items of 1,20€
 * Example 1: If the number of items is 4, no extra surcharge
 * Example 2: If the number of items is 5, 50 cents surcharge is added
 * Example 3: If the number of items is 10, 3€ surcharge (6 x 50 cents) is added
 * Example 4: If the number of items is 13, 5,70€ surcharge is added ((9 * 50 cents) + 1,20€)
 * Example 5: If the number of items is 14, 6,20€ surcharge is added ((10 * 50 cents) + 1,20€)
 * The delivery fee can never be more than 15€, including possible surcharges.
 * The delivery is free (0€) when the cart value is equal or more than 200€.
 * During the Friday rush, 3 - 7 PM, the delivery fee (the total fee including possible surcharges) will be multiplied by 1.2x. However, the fee still cannot be more than the max (15€). Considering timezone, for simplicity, use UTC as a timezone in backend solutions (so Friday rush is 3 - 7 PM UTC). In frontend solutions, use the timezone of the browser (so Friday rush is 3 - 7 PM in the timezone of the browser).
 */
describe("useDeliveryFeeCalculator hook", () => {
  it("getLowCartValueSurcharge should return 0 for a cart value over 10", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getLowCartValueSurcharge(10.5)).toBe(0);
  });
  it("getLowCartValueSurcharge should return 0 for a cart value of 10", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getLowCartValueSurcharge(10)).toBe(0);
  });
  it("getLowCartValueSurcharge should return 1 for a cart value of 9", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getLowCartValueSurcharge(9)).toBe(1);
  });

  it("getDistanceFee should return 2 for a distance under 1000 m", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getDistanceFee(200)).toBe(2);
  });
  it("getDistanceFee should return 2 for a distance of 1000 m", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getDistanceFee(1000)).toBe(2);
  });
  it("getDistanceFee should return 3 for a distance of 1499 m", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getDistanceFee(1499)).toBe(3);
  });
  it("getDistanceFee should return 3 for a distance of 1500 m", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getDistanceFee(1500)).toBe(3);
  });
  it("getDistanceFee should return 4 for a distance of 1501 m", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getDistanceFee(1501)).toBe(4);
  });

  it("getItemAmountFee should return 0 for an item count of 4", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getItemAmountFee(4)).toBe(0);
  });
  it("getItemAmountFee should return 0.5 for an item count of 5", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getItemAmountFee(5)).toBe(0.5);
  });
  it("getItemAmountFee should return 3 for an item count of 10", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getItemAmountFee(10)).toBe(3);
  });
  it("getItemAmountFee should return 5.7 for an item count of 13", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.getItemAmountFee(13)).toBe(5.7);
  });

  it("isFridayRush should return true for the date: 01/26/2024 17:00 (Friday between 15-19)", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.isFridayRush(new Date("01/26/2024 17:00"))).toBe(
      true
    );
  });
  it("isFridayRush should return false for the date: 01/26/2024 14:59 (Friday before 15)", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.isFridayRush(new Date("01/26/2024 14:59"))).toBe(
      false
    );
  });
  it("isFridayRush should return false for the date: 01/26/2024 19:01 (Friday after 19)", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.isFridayRush(new Date("01/26/2024 19:01"))).toBe(
      false
    );
  });
  it("isFridayRush should return false for the date: 01/25/2024 17:00 (Thursday between 15-19)", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    expect(result.current.isFridayRush(new Date("01/25/2024 17:00"))).toBe(
      false
    );
  });

  it("getDateTimeString should return 2024-01-25T17:00 for the date 01/25/2024 17:00", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    const testDate = new Date("01/25/2024 17:00");
    expect(result.current.getDateTimeString(testDate)).toBe("2024-01-25T17:00");
  });

  it("calculateDeliveryFee should throw an error if cartValue, distance or itemCount are undefined", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    const calculatorValues: DeliveryFeeCalculatorValues = {
      cartValue: undefined,
      distance: undefined,
      itemCount: undefined,
      orderTime: new Date(),
      fee: undefined
    }
    expect(() => result.current.calculateDeliveryFee(calculatorValues)).toThrowError("Missing required values for calculating delivery fee")
  });

  it("calculateDeliveryFee should return 0 if cartValue is equal to 200", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    const calculatorValues: DeliveryFeeCalculatorValues = {
      cartValue: 200,
      distance: 1000,
      itemCount: 30,
      orderTime: new Date(),
      fee: undefined
    }
    expect(result.current.calculateDeliveryFee(calculatorValues)).toBe(
      0
    );
  });
  it("calculateDeliveryFee should return 0 if cartValue is greater than 200", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    const calculatorValues: DeliveryFeeCalculatorValues = {
      cartValue: 300,
      distance: 1000,
      itemCount: 30,
      orderTime: new Date(),
      fee: undefined
    }
    expect(result.current.calculateDeliveryFee(calculatorValues)).toBe(
      0
    );
  });
  it("calculateDeliveryFee should return 15 at most", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    const calculatorValues: DeliveryFeeCalculatorValues = {
      cartValue: 1,
      distance: 5000,
      itemCount: 1000,
      orderTime: new Date(),
      fee: undefined
    }
    expect(result.current.calculateDeliveryFee(calculatorValues)).toBe(
      15
    );
  });
  it("calculateDeliveryFee should return 10 for a cart value of 2, a distance of 500 m, and a number of items of 1, when not in a Friday rush", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    const calculatorValues: DeliveryFeeCalculatorValues = {
      cartValue: 2,
      distance: 500,
      itemCount: 1,
      orderTime: new Date("01/25/2024 17:00"),
      fee: undefined
    }
    expect(result.current.calculateDeliveryFee(calculatorValues)).toBe(10)
  });
  it("calculateDeliveryFee should return 12 (x1.2 multiplier) for a cart value of 2, a distance of 500 m, and a number of items of 1, when in a Friday rush", () => {
    const { result } = renderHook(() => useDeliveryFeeCalculator());
    const calculatorValues: DeliveryFeeCalculatorValues = {
      cartValue: 2,
      distance: 500,
      itemCount: 1,
      orderTime: new Date("01/26/2024 17:00"),
      fee: undefined
    }
    expect(result.current.calculateDeliveryFee(calculatorValues)).toBe(12)
  });

});

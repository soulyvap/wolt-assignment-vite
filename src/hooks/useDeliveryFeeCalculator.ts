import { DeliveryFeeCalculatorValues } from "../types/DeliveryFeeCalculatorValues";

/**
 * Hook containing functions for calculating a delivery fee according to the rules defined in the assignment: https://github.com/woltapp/engineering-internship-2024
 */
export const useDeliveryFeeCalculator = () => {

  /**
   * Returns the surcharge for a cart value according to the following rule:
   * 
   * If the cart value is less than 10€, a small order surcharge is added to the delivery price. The surcharge is the difference between the cart value and 10€. For example if the cart value is 8.90€, the surcharge will be 1.10€.
   * @param cartValue 
   * @returns 
   */
  const getLowCartValueSurcharge = (cartValue: number) => {
    const surchargeLimit = 10;
    return Math.max(0, surchargeLimit - cartValue);
  };

  /**
   * Returns the delivery distance fee for a cart value according to the following rules:
   * 
   * A delivery fee for the first 1000 meters (=1km) is 2€. If the delivery distance is longer than that, 1€ is added for every additional 500 meters that the courier needs to travel before reaching the destination. Even if the distance would be shorter than 500 meters, the minimum fee is always 1€.
   ** Example 1: If the delivery distance is 1499 meters, the delivery fee is: 2€ base fee + 1€ for the additional 500 m => 3€
   ** Example 2: If the delivery distance is 1500 meters, the delivery fee is: 2€ base fee + 1€ for the additional 500 m => 3€
   ** Example 3: If the delivery distance is 1501 meters, the delivery fee is: 2€ base fee + 1€ for the first 500 m + 1€ for the second 500 m => 4€
   * @param distanceInMeters delivery distance in meters
   */
  const getDistanceFee = (distanceInMeters: number) => {
    const baseFeeDistance = 1000;
    const baseFee = 2;
    const distanceStep = 500;
    if (distanceInMeters <= baseFeeDistance) {
      return baseFee
    }
    return Math.ceil(distanceInMeters / distanceStep)
  };

  /**
   * Returns the delivery distance fee for a cart value according to the following rules:
   * 
   * If the number of items is five or more, an additional 50 cent surcharge is added for each item above and including the fifth item. An extra "bulk" fee applies for more than 12 items of 1,20€
   ** Example 1: If the number of items is 4, no extra surcharge
   ** Example 2: If the number of items is 5, 50 cents surcharge is added
   ** Example 3: If the number of items is 10, 3€ surcharge (6 x 50 cents) is added
   ** Example 4: If the number of items is 13, 5,70€ surcharge is added ((9 * 50 cents) + 1,20€)
   ** Example 5: If the number of items is 14, 6,20€ surcharge is added ((10 * 50 cents) + 1,20€)
   */
  const getItemAmountFee = (itemAmount: number) => {
    const maxItemsForFree = 4;
    const amountSurcharge = 0.5;
    const maxItemsForNoBulkCharge = 12;
    const bulkSurcharge = 1.2;
    if (itemAmount <= maxItemsForFree) {
      return 0;
    }
    let fee = (itemAmount - maxItemsForFree) * amountSurcharge;
    if (itemAmount > maxItemsForNoBulkCharge) {
      fee += bulkSurcharge;
    }
    return fee;
  };

  /**
   * Return true if the date is a Friday between 3PM and 7PM, false otherwise
   * @param date date to check
   */
  const isFridayRush = (date: Date) => {
    const rushStartHour = 15;
    const rushEndHour = 19;

    const isFriday = date.getDay() === 5;
    if (!isFriday) {
      return false;
    }
    const isAfter3PM = date.getHours() >= rushStartHour;
    const isBefore19PM =
      date.getHours() < rushEndHour || (date.getHours() === rushEndHour && date.getMinutes() === 0);
    const isRushTime = isAfter3PM && isBefore19PM;
    return isFriday && isRushTime;
  };

  /**
   * Returns the date and time string in the format "YYYY-MM-DDTHH:MM"
   * @param date date to format
   */
  const getDateTimeString = (date: Date) => {
    const dateCopy = new Date(date);
    dateCopy.setHours(date.getHours() - date.getTimezoneOffset() / 60);
    return dateCopy.toISOString().slice(0, 16);
  };

  /**
   * Returns the delivery fee.
   * Throws an error if any of the required values are undefined
   * @param values values used for calculating the delivery fee
   */
  const calculateDeliveryFee = (values: DeliveryFeeCalculatorValues) => {
    const {cartValue, distance, itemCount, orderTime} = values
    if (cartValue === undefined || distance === undefined || itemCount === undefined) {
      throw new Error("Missing required values for calculating delivery fee")
    }
    // The delivery is free (0€) when the cart value is equal or more than 200€.
    const cartValueForFreeDelivery = 200;
    if (cartValue >= cartValueForFreeDelivery) {
      return 0;
    }
    // The delivery fee can never be more than 15€, including possible surcharges.
    const maxDeliveryFee = 15;
    const isFridayRushTime = isFridayRush(orderTime);
    const fridayRushMuliplier = 1.2;
    let fee = getLowCartValueSurcharge(cartValue) 
    + getDistanceFee(distance)
    + getItemAmountFee(itemCount);
    if (isFridayRushTime) {
      fee *= fridayRushMuliplier;
    }
    return Math.min(fee, maxDeliveryFee)
  };

  return { getLowCartValueSurcharge, getDistanceFee, getItemAmountFee, isFridayRush, calculateDeliveryFee, getDateTimeString };
};

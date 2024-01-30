/**
 * Interface for the values used by the DeliveryFeeCalculator
 */
export interface DeliveryFeeCalculatorValues {
  cartValue: number | undefined
  distance: number | undefined
  itemCount: number | undefined
  orderTime: Date
  fee: number | undefined
}
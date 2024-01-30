/**
 * Interface for the values used by the DeliveryFeeCalculator
 */
export interface DeliveryFeeCalculatorValues {
  cartValue: string | undefined
  distance: string | undefined
  itemCount: string | undefined
  orderTime: string
  fee: number | undefined
}
export interface OrderItem {
  bookId: number
  quantity: number
  price: number
}

export interface OrderRequest {
  addressOfBuyer: string
  price: number
  paymentId: number
  deliveryMethodId: number
  items: OrderItem[]
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export enum DeliveryStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  PROCESSING = "PROCESSING",
}

export interface Order {
  id: number
  addressOfBuyer: string
  price: number
  paymentId: number
  deliveryMethodId: number
  items: OrderItem[]
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
}

export interface Payment {
  id: number
  nameOfPayment: string
}

export interface DeliveryMethod {
  id: number
  nameOfDeliveryMethod: string
}

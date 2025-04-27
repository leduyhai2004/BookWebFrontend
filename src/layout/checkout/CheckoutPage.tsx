"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import type { CartItem } from "../../models/CartItem"
import type { DeliveryMethod, OrderItem, OrderRequest, Payment } from "../../models/Order"
import { getCart, calculateCartTotal, clearCart } from "../../utils/cartUtils"
import { createOrder, getDeliveryMethods, getPaymentMethods } from "../../api/OrderAPI"
import FormatNumber from "../utils/FormatNumber"

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [address, setAddress] = useState("")
  const [paymentId, setPaymentId] = useState<number>(0)
  const [deliveryMethodId, setDeliveryMethodId] = useState<number>(0)
  const [paymentMethods, setPaymentMethods] = useState<Payment[]>([])
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to proceed with checkout")
      navigate("/login")
      return
    }

    // Load cart items
    const items = getCart()
    if (items.length === 0) {
      toast.error("Your cart is empty")
      navigate("/cart")
      return
    }

    setCartItems(items)
    setTotalPrice(calculateCartTotal())

    // Load payment and delivery methods
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [payments, deliveries] = await Promise.all([getPaymentMethods(), getDeliveryMethods()])

        setPaymentMethods(payments)
        setDeliveryMethods(deliveries)

        // Set default values if available
        if (payments.length > 0) {
          setPaymentId(payments[0].id)
        }
        if (deliveries.length > 0) {
          setDeliveryMethodId(deliveries[0].id)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching checkout data:", error)
        toast.error("Failed to load checkout information")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!address) {
      toast.error("Please enter your delivery address")
      return
    }

    if (!paymentId) {
      toast.error("Please select a payment method")
      return
    }

    if (!deliveryMethodId) {
      toast.error("Please select a delivery method")
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare order items - create simplified objects without circular references
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.book.priceSell || 0,
      }))

      // Create order request with only the necessary data
      const orderRequest: OrderRequest = {
        addressOfBuyer: address,
        price: totalPrice,
        paymentId,
        deliveryMethodId,
        items: orderItems,
      }

      // Log the request for debugging
      console.log("Sending order request:", JSON.stringify(orderRequest))

      // Submit order - we don't need the response data, just need to know if it succeeded
      await createOrder(orderRequest)

      // Clear cart
      clearCart()

      toast.success("Order placed successfully!")

      // Navigate to orders page
      navigate("/orders")
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading checkout information...</p>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Checkout</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmitOrder}>
                <div className="mb-4">
                  <h5>Delivery Address</h5>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter your full delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5>Payment Method</h5>
                    <select
                      className="form-select"
                      value={paymentId}
                      onChange={(e) => setPaymentId(Number(e.target.value))}
                      required
                    >
                      <option value="">Select Payment Method</option>
                      {paymentMethods.map((payment) => (
                        <option key={payment.id} value={payment.id}>
                          {payment.nameOfPayment}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <h5>Delivery Method</h5>
                    <select
                      className="form-select"
                      value={deliveryMethodId}
                      onChange={(e) => setDeliveryMethodId(Number(e.target.value))}
                      required
                    >
                      <option value="">Select Delivery Method</option>
                      {deliveryMethods.map((delivery) => (
                        <option key={delivery.id} value={delivery.id}>
                          {delivery.nameOfDeliveryMethod}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <Link to="/cart" className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Cart
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Order Summary</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Items ({cartItems.length})</h6>
                <ul className="list-group mb-3">
                  {cartItems.map((item) => (
                    <li key={item.bookId} className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">{item.book.name}</h6>
                        <small className="text-muted">
                          {item.quantity} x {FormatNumber(item.book.priceSell || 0)} VND
                        </small>
                      </div>
                      <span className="text-muted">{FormatNumber((item.book.priceSell || 0) * item.quantity)} VND</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{FormatNumber(totalPrice)} VND</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>{FormatNumber(totalPrice)} VND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

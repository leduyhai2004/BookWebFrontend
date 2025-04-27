"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import type { Order, DeliveryStatus, PaymentStatus } from "../../models/Order"
import { getUserOrders } from "../../api/OrderAPI"
import FormatNumber from "../utils/FormatNumber"

const OrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to view your orders")
      navigate("/login")
      return
    }

    // Fetch user orders
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const userOrders = await getUserOrders()
        setOrders(userOrders)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders. Please try again.")
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [navigate])

  // Helper function to get status badge class
  const getStatusBadgeClass = (status: PaymentStatus | DeliveryStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-warning"
      case "PAID":
      case "DELIVERED":
        return "bg-success"
      case "SHIPPED":
        return "bg-info"
      case "FAILED":
      case "CANCELLED":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <Link to="/" className="btn btn-outline-primary">
          <i className="fas fa-home me-2"></i>
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-shopping-bag fa-4x mb-3 text-muted"></i>
          <h3>You haven't placed any orders yet</h3>
          <p className="text-muted">Start shopping and your orders will appear here.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Order #{order.id}</h5>
                    <div>
                      <span className={`badge ${getStatusBadgeClass(order.paymentStatus)} me-2`}>
                        Payment: {order.paymentStatus}
                      </span>
                      <span className={`badge ${getStatusBadgeClass(order.deliveryStatus)}`}>
                        Delivery: {order.deliveryStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Delivery Address:</h6>
                      <p>{order.addressOfBuyer}</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <h6>Total Amount:</h6>
                      <p className="text-primary fw-bold">{FormatNumber(order.price)} VND</p>
                    </div>
                  </div>

                  <h6>Order Items:</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Book ID</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Link to={`/books/${item.bookId}`}>#{item.bookId}</Link>
                            </td>
                            <td>{item.quantity}</td>
                            <td>{FormatNumber(item.price)} VND</td>
                            <td>{FormatNumber(item.price * item.quantity)} VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-white">
                  <small className="text-muted">
                    Payment Method ID: {order.paymentId} | Delivery Method ID: {order.deliveryMethodId}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage

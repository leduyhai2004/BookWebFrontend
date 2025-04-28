"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import type { Order } from "../../../models/Order"
import { getAdminOrders, deleteOrder, getPaymentMethodById, getDeliveryMethodById } from "../../../api/OrderAPI"
import FormatNumber from "../../utils/FormatNumber"
import RequireAdmin from "../RequireAdmin"
import { Pencil, Trash } from "react-bootstrap-icons"

// Interface for enhanced order with payment and delivery method names
interface EnhancedOrder extends Order {
  paymentMethodName?: string
  deliveryMethodName?: string
}

// Define PaymentStatus and DeliveryStatus enums
const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
}
type PaymentStatus = keyof typeof PaymentStatus

const DeliveryStatus = {
  PENDING: "PENDING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
}
type DeliveryStatus = keyof typeof DeliveryStatus

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<EnhancedOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      let allOrders: Order[] = []

      try {
        allOrders = await getAdminOrders()
      } catch (error) {
        console.error("Error fetching admin orders:", error)
        toast.error("There was an issue loading the orders")
        setOrders([])
        setIsLoading(false)
        return
      }

      // Enhance orders with payment and delivery method names
      const enhancedOrders = await Promise.all(
        allOrders.map(async (order) => {
          try {
            // Fetch payment method details
            let paymentMethodName = "Unknown"
            let deliveryMethodName = "Unknown"

            try {
              const paymentMethod = await getPaymentMethodById(order.paymentId)
              paymentMethodName = paymentMethod.nameOfPayment
            } catch (error) {
              console.error(`Error fetching payment method for order ${order.id}:`, error)
            }

            try {
              // Fetch delivery method details
              const deliveryMethod = await getDeliveryMethodById(order.deliveryMethodId)
              deliveryMethodName = deliveryMethod.nameOfDeliveryMethod
            } catch (error) {
              console.error(`Error fetching delivery method for order ${order.id}:`, error)
            }

            // Return enhanced order with method names
            return {
              ...order,
              paymentMethodName,
              deliveryMethodName,
            }
          } catch (error) {
            console.error(`Error enhancing order ${order.id}:`, error)
            // Return original order if enhancement fails
            return {
              ...order,
              paymentMethodName: "Unknown",
              deliveryMethodName: "Unknown",
            }
          }
        }),
      )

      setOrders(enhancedOrders)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders. Please try again.")
      setIsLoading(false)
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setIsDeleting(true)
        await deleteOrder(orderId)
        toast.success("Order deleted successfully")
        // Refresh the orders list
        fetchOrders()
      } catch (error) {
        console.error("Error deleting order:", error)
        toast.error("Failed to delete order")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Helper function to get status badge class
  const getStatusBadgeClass = (status: PaymentStatus | DeliveryStatus | string) => {
    switch (status) {
      case PaymentStatus.PENDING:
      case DeliveryStatus.PENDING:
        return "bg-warning"
      case PaymentStatus.PAID:
      case DeliveryStatus.DELIVERED:
        return "bg-success"
      case DeliveryStatus.SHIPPED:
        return "bg-info"
      case PaymentStatus.FAILED:
      case DeliveryStatus.CANCELLED:
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
        <p className="mt-2">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={fetchOrders}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Management</h2>
        <Link to="/admin/dashboard" className="btn btn-outline-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Dashboard
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer Address</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Delivery Method</th>
                <th>Delivery Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.addressOfBuyer}</td>
                  <td>{order.paymentMethodName || `ID: ${order.paymentId}`}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`}>{order.paymentStatus}</span>
                  </td>
                  <td>{order.deliveryMethodName || `ID: ${order.deliveryMethodId}`}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.deliveryStatus)}`}>{order.deliveryStatus}</span>
                  </td>
                  <td>{FormatNumber(order.price)} VND</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/admin/orders/edit/${order.id}`}
                        className="btn btn-sm btn-warning me-1"
                        title="Edit"
                        onClick={() => console.log(`Navigating to edit order ${order.id}`)}
                      >
                        <Pencil />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={isDeleting}
                        title="Delete"
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <h3>Order Details</h3>
        <p>Click on the edit button to view and update order details.</p>
      </div>
    </div>
  )
}

const AdminOrdersPage_Admin = RequireAdmin(AdminOrdersPage)
export default AdminOrdersPage_Admin

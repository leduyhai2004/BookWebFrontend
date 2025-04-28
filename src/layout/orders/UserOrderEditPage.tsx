"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import type { Order } from "../../models/Order"
import { updateOrderAddressAsUser } from "../../api/OrderAPI"
import FormatNumber from "../utils/FormatNumber"

// Add this component at the top of the file, after imports
const OrderItemImage: React.FC<{ bookId: number; width?: string; height?: string; className?: string }> = ({
  bookId,
  width = "100%",
  height = "auto",
  className = "",
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:8080/books/${bookId}/imageList?sort=id,asc&page=0&size=1`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch image")
        }

        const data = await response.json()
        if (data._embedded && data._embedded.images && data._embedded.images.length > 0) {
          setImageUrl(data._embedded.images[0].dataImage)
        }
      } catch (error) {
        console.error("Error fetching book image:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [bookId])

  if (loading) {
    return (
      <div className="placeholder-glow" style={{ width, height }}>
        <span className="placeholder col-12 h-100"></span>
      </div>
    )
  }

  return (
    <img
      src={imageUrl || "/placeholder.svg"}
      alt={`Book #${bookId}`}
      className={`img-thumbnail ${className}`}
      style={{ width, height, objectFit: "cover" }}
    />
  )
}

const UserOrderEditPage: React.FC = () => {
  // Log the current URL to help with debugging
  console.log("Current URL:", window.location.href)

  const params = useParams()
  console.log("URL Parameters:", params)

  const { id } = params
  console.log("Order ID from params:", id)

  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [addressOfBuyer, setAddressOfBuyer] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Directly test the API to see if it's working
  useEffect(() => {
    const testApi = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }

      try {
        // Test with a hardcoded ID first to see if the API works
        const testId = 1 // Use a known valid order ID
        const response = await fetch(`http://localhost:8080/api/orders/user/${testId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("API Test Response Status:", response.status)
        if (response.ok) {
          const data = await response.json()
          console.log("API Test Response Data:", data)
        } else {
          const errorText = await response.text()
          console.error("API Test Error:", errorText)
        }
      } catch (error) {
        console.error("API Test Exception:", error)
      }
    }

    testApi()
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to edit your order")
      navigate("/login")
      return
    }

    // Check if ID exists and is valid
    if (!id) {
      console.error("Order ID is missing from URL parameters")
      setError("Order ID is missing")
      setIsLoading(false)
      return
    }

    const orderId = Number.parseInt(id)
    if (isNaN(orderId) || orderId <= 0) {
      console.error(`Invalid order ID: ${id}`)
      setError("Invalid order ID")
      setIsLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)
        console.log(`Fetching order details for ID: ${orderId}`)

        // Use the specified API endpoint
        const response = await fetch(`http://localhost:8080/api/orders/user/${orderId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Failed to fetch order: ${response.status} ${errorText}`)
          throw new Error(`Failed to fetch order: ${response.status}`)
        }

        const orderData = await response.json()
        console.log("Order data received:", orderData)
        setOrder(orderData)
        setAddressOfBuyer(orderData.addressOfBuyer)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("Failed to load order details. Please try again.")
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id, navigate])

  // Rest of the component remains the same...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !order) return

    try {
      setIsSubmitting(true)
      const orderId = Number.parseInt(id)
      await updateOrderAddressAsUser(orderId, addressOfBuyer)
      toast.success("Order address updated successfully")
      navigate("/orders")
    } catch (error) {
      console.error("Error updating order address:", error)
      toast.error("Failed to update order address")
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
        <p className="mt-2">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error || "Order not found"}
        </div>
        <Link to="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Update Delivery Address for Order #{order.id}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="addressOfBuyer" className="form-label">
                    Delivery Address
                  </label>
                  <textarea
                    id="addressOfBuyer"
                    className="form-control"
                    rows={3}
                    value={addressOfBuyer}
                    onChange={(e) => setAddressOfBuyer(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between">
                  <Link to="/orders" className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Orders
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6>Order Status:</h6>
                  <p>
                    <span className="badge bg-info me-2">Payment: {order.paymentStatus}</span>
                    <span className="badge bg-info">Delivery: {order.deliveryStatus}</span>
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <h6>Total Amount:</h6>
                  <p className="text-primary fw-bold">{FormatNumber(order.price)} VND</p>
                </div>
              </div>

              <h6>Order Items:</h6>
              <div className="list-group">
                {order.items.map((item, index) => (
                  <div key={index} className="list-group-item d-flex align-items-center">
                    <OrderItemImage bookId={item.bookId} width="40px" height="60px" className="me-2" />
                    <div>
                      <div>
                        <Link to={`/books/${item.bookId}`} className="text-decoration-none">
                          Book #{item.bookId}
                        </Link>
                      </div>
                      <small>
                        {item.quantity} x {FormatNumber(item.price)} VND
                      </small>
                    </div>
                    <span className="ms-auto">{FormatNumber(item.price * item.quantity)} VND</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserOrderEditPage

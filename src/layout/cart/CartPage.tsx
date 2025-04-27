"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { CartItem } from "../../models/CartItem"
import { getCart, removeFromCart, updateCartItemQuantity, calculateCartTotal } from "../../utils/cartUtils"
import FormatNumber from "../utils/FormatNumber"
import { toast } from "react-toastify"
import BookImage from "../product/components/BookImageThumbnail"

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = () => {
    const items = getCart()
    setCartItems(items)
    setTotalPrice(calculateCartTotal())
  }

  const handleRemoveItem = (bookId: number) => {
    removeFromCart(bookId)
    toast.info("Item removed from cart")
    loadCartItems()
  }

  const handleQuantityChange = (bookId: number, quantity: number) => {
    if (quantity < 1) return

    const item = cartItems.find((item) => item.bookId === bookId)
    if (item && item.book.quantity && quantity > item.book.quantity) {
      toast.warning(`Only ${item.book.quantity} items available in stock`)
      return
    }

    updateCartItemQuantity(bookId, quantity)
    loadCartItems()
  }

  const handleProceedToCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to proceed with checkout")
      navigate("/login")
      return
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    // Navigate to checkout page
    navigate("/checkout")
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-shopping-cart fa-4x mb-3 text-muted"></i>
          <h3>Your cart is empty</h3>
          <p className="text-muted">Looks like you haven't added any books to your cart yet.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.bookId}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Link to={`/books/${item.bookId}`}>
                          <BookImage bookId={item.bookId} width="60px" height="80px" />
                        </Link>
                        <div>
                          <Link to={`/books/${item.bookId}`} className="text-decoration-none">
                            <h6 className="mb-0">{item.book.name}</h6>
                          </Link>
                          <small className="text-muted">{item.book.author}</small>
                        </div>
                      </div>
                    </td>
                    <td>{FormatNumber(item.book.priceSell || 0)} VND</td>
                    <td>
                      <div className="input-group" style={{ width: "120px" }}>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.bookId, Number.parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => handleQuantityChange(item.bookId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{FormatNumber((item.book.priceSell || 0) * item.quantity)} VND</td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveItem(item.bookId)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
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
                  <button className="btn btn-primary w-100 mt-3" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-end align-items-start">
              <Link to="/" className="btn btn-outline-primary me-2">
                <i className="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </Link>
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.removeItem("cart")
                  loadCartItems()
                  toast.info("Cart cleared")
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage

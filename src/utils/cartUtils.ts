import type { CartItem } from "../models/CartItem"
import type Book from "../models/Book"

// Get cart from localStorage
export const getCart = (): CartItem[] => {
  const cartJson = localStorage.getItem("cart")
  return cartJson ? JSON.parse(cartJson) : []
}

// Save cart to localStorage
export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem("cart", JSON.stringify(cart))
  // Dispatch custom event to notify components about cart update
  window.dispatchEvent(new Event("cartUpdated"))
}

// Add item to cart
export const addToCart = (book: Book, quantity = 1): void => {
  const cart = getCart()
  const existingItemIndex = cart.findIndex((item) => item.bookId === book.id)

  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item
    cart.push({
      bookId: book.id,
      quantity: quantity,
      book: book,
    })
  }

  saveCart(cart)
}

// Remove item from cart
export const removeFromCart = (bookId: number): void => {
  const cart = getCart()
  const updatedCart = cart.filter((item) => item.bookId !== bookId)
  saveCart(updatedCart)
}

// Update item quantity
export const updateCartItemQuantity = (bookId: number, quantity: number): void => {
  const cart = getCart()
  const itemIndex = cart.findIndex((item) => item.bookId === bookId)

  if (itemIndex >= 0) {
    cart[itemIndex].quantity = quantity
    saveCart(cart)
  }
}

// Calculate total price
export const calculateCartTotal = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => {
    return total + (item.book.priceSell || 0) * item.quantity
  }, 0)
}

// Get cart item count
export const getCartItemCount = (): number => {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}


"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type Book from "../../models/Book"
import { getFavorites, removeFromFavorites } from "../../utils/favoriteUtils"
import { addToCart } from "../../utils/cartUtils"
import FormatNumber from "../utils/FormatNumber"
import renderRating from "../utils/RenderStar"
import { toast } from "react-toastify"

// Define a more flexible book interface to handle different API response structures
interface FavoriteBook extends Partial<Book> {
  id?: number
  bookId?: number // Alternative ID field that might be in the API response
  book_id?: number // Another possible ID field
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
      loadFavorites()
    } else {
      setIsLoggedIn(false)
      setLoading(false)
    }
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const response = await getFavorites()

      // Log the raw response to see its structure
      console.log("Raw favorites response:", response)

      // Process the response to ensure each book has an id
      const processedFavorites = response.map((book) => {
        // Create a new object to avoid mutating the original
        const processedBook: FavoriteBook = { ...book }

        // If id is missing, try to use alternative ID fields
        if (processedBook.id === undefined) {
          if (processedBook.bookId !== undefined) {
            processedBook.id = processedBook.bookId
            console.log(`Using bookId (${processedBook.bookId}) as id for book:`, processedBook.name)
          } else if (processedBook.book_id !== undefined) {
            processedBook.id = processedBook.book_id
            console.log(`Using book_id (${processedBook.book_id}) as id for book:`, processedBook.name)
          } else {
            // If we still don't have an ID, generate a temporary one
            // This is just for display purposes and won't work for API calls
            console.error("Book missing all ID fields:", processedBook)
          }
        }

        return processedBook
      })

      console.log("Processed favorites:", processedFavorites)
      setFavorites(processedFavorites)
      setLoading(false)
    } catch (err) {
      console.error("Error loading favorites:", err)
      setError("Failed to load favorites. Please try again.")
      setLoading(false)
    }
  }

  const handleRemoveFromFavorites = async (book: FavoriteBook) => {
    try {
      // Determine which ID to use
      const bookId = book.id || book.bookId || book.book_id

      // Make sure bookId is a valid number
      if (bookId === undefined || bookId === null || isNaN(Number(bookId))) {
        console.error("Invalid bookId:", bookId, "for book:", book)
        toast.error("Cannot remove book: Missing ID")
        return
      }

      console.log("Removing book with ID:", bookId, "Book:", book)
      const success = await removeFromFavorites(Number(bookId))
      if (success) {
        toast.info(`Item removed from favorites`)
        loadFavorites()
      } else {
        toast.error("Failed to remove from favorites")
      }
    } catch (err) {
      console.error("Error removing from favorites:", err)
      toast.error("Failed to remove from favorites")
    }
  }

  const handleAddToCart = (book: FavoriteBook) => {
    addToCart(book as Book)
    toast.success(`Added ${book.name} to cart!`)
  }

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your favorites...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <i className="fas fa-user-lock fa-4x mb-3 text-muted"></i>
          <h3>Please log in to view your favorites</h3>
          <p className="text-muted">You need to be logged in to access your favorites list.</p>
          <Link to="/login" className="btn btn-primary mt-3">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={loadFavorites}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Favorites</h2>
        <Link to="/" className="btn btn-outline-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Continue Shopping
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-heart fa-4x mb-3 text-muted"></i>
          <h3>Your favorites list is empty</h3>
          <p className="text-muted">Save items you like by clicking the heart icon on any book.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="row">
          {favorites.map((book, index) => {
            // Use index as key if no ID is available
            const bookKey = book.id || book.bookId || book.book_id || `temp-${index}`

            return (
              <div key={bookKey} className="col-md-3 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    <Link to={`/books/${bookKey}`}>
                      <img
                        src={book.imageURL || "/placeholder.svg"}
                        alt={book.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Link>
                    <button
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                      onClick={() => handleRemoveFromFavorites(book)}
                    >
                      <i className="fas fa-heart-broken"></i>
                    </button>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <Link to={`/books/${bookKey}`} className="text-decoration-none">
                      <h5 className="card-title">{book.name}</h5>
                    </Link>
                    <p className="card-text text-muted">{book.author}</p>
                    <div className="mb-2">{renderRating(book.rating || 0)}</div>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-danger fw-bold">{FormatNumber(book.priceSell || 0)} VND</span>
                        {book.priceOrigin && book.priceOrigin > (book.priceSell || 0) && (
                          <span className="text-muted text-decoration-line-through">
                            {FormatNumber(book.priceOrigin)} VND
                          </span>
                        )}
                      </div>
                      <button className="btn btn-primary w-100" onClick={() => handleAddToCart(book)}>
                        <i className="fas fa-shopping-cart me-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage

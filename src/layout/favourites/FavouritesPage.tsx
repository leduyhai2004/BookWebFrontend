"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { FavoriteItem } from "../../models/CartItem"
import { getFavorites, removeFromFavorites } from "../../utils/favoriteUtils"
import { addToCart } from "../../utils/cartUtils"
import FormatNumber from "../utils/FormatNumber"
import renderRating from "../utils/RenderStar"
import { toast } from "react-toastify"
import BookImage from "../product/components/BookImageThumbnail"

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    const items = getFavorites()
    setFavorites(items)
  }

  const handleRemoveFromFavorites = (bookId: number) => {
    removeFromFavorites(bookId)
    toast.info("Item removed from favorites")
    loadFavorites()
  }

  const handleAddToCart = (item: FavoriteItem) => {
    addToCart(item.book)
    toast.success(`Added ${item.book.name} to cart!`)
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Your Favorites</h2>

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
          {favorites.map((item) => (
            <div key={item.bookId} className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="position-relative">
                  <Link to={`/books/${item.bookId}`}>
                    <BookImage bookId={item.bookId} height="200px" />
                  </Link>
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    onClick={() => handleRemoveFromFavorites(item.bookId)}
                  >
                    <i className="fas fa-heart-broken"></i>
                  </button>
                </div>
                <div className="card-body d-flex flex-column">
                  <Link to={`/books/${item.bookId}`} className="text-decoration-none">
                    <h5 className="card-title">{item.book.name}</h5>
                  </Link>
                  <p className="card-text text-muted">{item.book.author}</p>
                  <div className="mb-2">{renderRating(item.book.rating || 0)}</div>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-danger fw-bold">{FormatNumber(item.book.priceSell || 0)} VND</span>
                      {item.book.priceOrigin && item.book.priceOrigin > (item.book.priceSell || 0) && (
                        <span className="text-muted text-decoration-line-through">
                          {FormatNumber(item.book.priceOrigin)} VND
                        </span>
                      )}
                    </div>
                    <button className="btn btn-primary w-100" onClick={() => handleAddToCart(item)}>
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage


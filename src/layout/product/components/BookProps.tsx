"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type Book from "../../../models/Book"
import type Image from "../../../models/Image"
import { getAllImagesOfABook } from "../../../api/ImageAPI"
import { Link } from "react-router-dom"
import renderRating from "./../../utils/RenderStar"
import { addToCart } from "../../../utils/cartUtils"
import { addToFavorites, isInFavorites, removeFromFavorites } from "../../../utils/favoriteUtils"
import { toast } from "react-toastify"

interface BookPropsInterface {
  book: Book
}
const BookProps: React.FC<BookPropsInterface> = (props) => {
  const book_id: number = props.book.id
  const [listImage, setListImage] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkingFavorite, setCheckingFavorite] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch images
        const imageData = await getAllImagesOfABook(book_id)
        setListImage(imageData)

        // Check if book is in favorites
        setCheckingFavorite(true)
        const favoriteStatus = await isInFavorites(book_id)
        setIsFavorite(favoriteStatus)
        setCheckingFavorite(false)

        setLoading(false)
      } catch (error) {
        console.error("Error in BookProps:", error)
        // setError(error)
        setLoading(false)
        setCheckingFavorite(false)
      }
    }

    fetchData()
  }, [book_id])

  // Update the useEffect that listens for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = async () => {
      try {
        const result = await isInFavorites(book_id)
        setIsFavorite(result)
      } catch (error) {
        console.error("Error checking favorites:", error)
      }
    }

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate)

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate)
    }
  }, [book_id])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(props.book)
    toast.success(`Added ${props.book.name} to cart!`)
  }

  // Update the handleToggleFavorite function to use the API
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      if (isFavorite) {
        const success = await removeFromFavorites(book_id)
        if (success) {
          toast.info(`Removed ${props.book.name} from favorites`)
          setIsFavorite(false)
        } else {
          toast.error("Failed to remove from favorites")
        }
      } else {
        const success = await addToFavorites(book_id)
        if (success) {
          toast.success(`Added ${props.book.name} to favorites!`)
          setIsFavorite(true)
        } else {
          toast.error("Failed to add to favorites")
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="col-md-3 mt-2">
        <div className="card" style={{ height: "400px" }}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-md-3 mt-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-danger">Error</h5>
            <p className="card-text">Failed to load book information</p>
          </div>
        </div>
      </div>
    )
  }

  let dataImage = ""
  if (listImage[0] && listImage[0].dataImage) {
    dataImage = listImage[0].dataImage
  }

  return (
    <div className="col-md-3 mt-2">
      <div className="card">
        <Link to={`/books/${props.book.id}`}>
          <img
            src={dataImage || "/placeholder.svg"}
            className="card-img-top"
            alt={props.book.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        </Link>

        <div className="card-body">
          <Link to={`/books/${props.book.id}`} style={{ textDecoration: "none" }}>
            <h5 className="card-title">{props.book.name}</h5>
          </Link>

          <p className="card-text">{props.book.description}</p>
          <div className="price">
            <span className="original-price">
              <del>{props.book.priceOrigin}</del>
            </span>
            <span className="discounted-price">
              <strong>{props.book.priceSell}</strong>
            </span>
          </div>
          <div className="row mt-2" role="group">
            <div className="col-6">{renderRating(props.book.rating ? props.book.rating : 0)}</div>
            <div className="col-6 text-end">
              <button
                className={`btn ${isFavorite ? "btn-danger" : "btn-light border"} btn-sm me-2`}
                onClick={handleToggleFavorite}
                disabled={checkingFavorite}
              >
                {checkingFavorite ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="fas fa-heart"></i>
                )}
              </button>

              <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BookProps

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

  useEffect(() => {
    getAllImagesOfABook(book_id)
      .then((imageData) => {
        setListImage(imageData)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
      })

    // Check if book is in favorites
    setIsFavorite(isInFavorites(book_id))
  }, [book_id])

  // Listen for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setIsFavorite(isInFavorites(book_id))
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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isFavorite) {
      removeFromFavorites(book_id)
      toast.info(`Removed ${props.book.name} from favorites`)
    } else {
      addToFavorites(props.book)
      toast.success(`Added ${props.book.name} to favorites!`)
    }
    setIsFavorite(!isFavorite)
  }

  if (loading) {
    return (
      <div>
        <h1>The Page is loading ...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>It has error: ${error}</h1>
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
            style={{ height: "200px" }}
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
                className={`btn ${isFavorite ? "btn-danger" : "btn-secondary"} btn-sm me-2`}
                onClick={handleToggleFavorite}
              >
                <i className="fas fa-heart"></i>
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


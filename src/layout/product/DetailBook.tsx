"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import type Book from "../../models/Book"
import { findBookById } from "../../api/BookAPI"
import BookImage from "./components/BookImage"
import EvaluateProduct from "./components/EvaluateProduct"
import renderRating from "./../utils/RenderStar"
import FormatNumber from "../utils/FormatNumber"
import { addToCart } from "../../utils/cartUtils"
import { addToFavorites, isInFavorites, removeFromFavorites } from "../../utils/favoriteUtils"
import { toast } from "react-toastify"

const DetailBook: React.FC = () => {
  const { id } = useParams()
  console.log("Sach chi tiet voi id", id)
  //khai bao
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const increaseQuantity = () => {
    const numberOfBooksWeHas = book && book?.quantity ? book?.quantity : 0
    if (quantity < numberOfBooksWeHas) setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity >= 2) {
      setQuantity(quantity - 1)
    }
  }

  const handleQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(event.target.value)
    const numberOfBooksWeHas = book && book?.quantity ? book?.quantity : 0
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= numberOfBooksWeHas) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (book) {
      addToCart(book, quantity)
      toast.success(`Added ${quantity} ${book.name} to cart!`)
    }
  }

  const handleToggleFavorite = () => {
    if (!book) return

    if (isFavorite) {
      removeFromFavorites(book.id)
      toast.info(`Removed ${book.name} from favorites`)
    } else {
      addToFavorites(book)
      toast.success(`Added ${book.name} to favorites!`)
    }
    setIsFavorite(!isFavorite)
  }

  let book_id = 0
  try {
    book_id = Number.parseInt(id + "")
    if (Number.isNaN(book_id)) {
      book_id = 0
    }
  } catch (error) {
    book_id = 0
    console.error("Error", error)
  }

  useEffect(() => {
    findBookById(book_id)
      .then((book) => {
        setBook(book)
        setLoading(false)
        if (book) {
          setIsFavorite(isInFavorites(book.id))
        }
      })
      .catch((error) => {
        setError(error)
      })
  }, [book_id])

  // Listen for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      if (book) {
        setIsFavorite(isInFavorites(book.id))
      }
    }

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate)

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate)
    }
  }, [book])

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

  if (!book) {
    return (
      <div>
        <h1>This Book is not existed</h1>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="w-80 p-4 bg-white rounded shadow">
          <div className="row">
            <div className="col-md-6">
              <BookImage book_id={book_id} />
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="fw-bold text-dark">{book.name}</h2>
                <button
                  className={`btn ${isFavorite ? "btn-danger" : "btn-light border"}`}
                  onClick={handleToggleFavorite}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <h4 className="text-danger fw-bold">{FormatNumber(book.priceSell)} VND</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col-3">#</th>
                    <th scope="col-9">First</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>@fat</td>
                  </tr>
                </tbody>
              </table>
              <p>{book.description}</p>
              <div className="mb-3">
                <span className=" text-dark">{renderRating(book.rating ? book.rating : 0)}</span> ({book.rating})
              </div>
              <div className="col-4 mb-2">
                <div className="mb-2">Quantity</div>
                <div className="d-flex align-items-center justify-content-between gap-8">
                  <div className="d-flex align-items-center ">
                    <button className="btn btn-outline-primary me-2" onClick={decreaseQuantity}>
                      -
                    </button>
                    <input
                      className="form-control text-center"
                      type="number"
                      value={quantity}
                      min={1}
                      onChange={handleQuantity}
                      style={{ width: "100px" }}
                    />
                    <button className="btn btn-outline-primary ms-2" onClick={increaseQuantity}>
                      +
                    </button>
                  </div>
                  {book.priceSell && (
                    <div className="text-center ms-5">
                      TotalPrice
                      <br />
                      <h4>{FormatNumber(quantity * book.priceSell)}đ</h4>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center"
                  onClick={handleAddToCart}
                >
                  <i className="fas fa-shopping-cart me-2"></i> Thêm vào giỏ hàng
                </button>
                <Link to="/cart" className="btn btn-primary w-50 d-flex align-items-center justify-content-center">
                  <i className="fas fa-credit-card me-2"></i> Mua ngay
                </Link>
              </div>
            </div>
          </div>
          <EvaluateProduct book_id={book_id} />
        </div>
      </div>
    </div>
  )
}
export default DetailBook


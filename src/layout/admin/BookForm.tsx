"use client"

import type React from "react"
import { type FormEvent, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import "../../css/BookForm.css"
import RequireAdmin from "./RequireAdmin"

const BookForm: React.FC = () => {
  const navigate = useNavigate()

  const [book, setBook] = useState({
    id: 0,
    name: "",
    author: "",
    isbn: "",
    description: "",
    priceOrigin: 0,
    priceSell: 0,
    quantity: 0,
    rating: 0,
  })

  // State for images
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Convert FileList to array and add to existing images
      const newFiles = Array.from(files)
      const updatedFiles = [...imageFiles, ...newFiles]
      setImageFiles(updatedFiles)

      // Create preview URLs for the new images
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setImagePreviews([...imagePreviews, ...newPreviews])

      // If this is the first image, set it as the main image
      if (imageFiles.length === 0 && newFiles.length > 0) {
        setMainImageIndex(0)
      }
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    // Create new arrays without the removed image
    const updatedFiles = [...imageFiles]
    const updatedPreviews = [...imagePreviews]

    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index])

    updatedFiles.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setImageFiles(updatedFiles)
    setImagePreviews(updatedPreviews)

    // Adjust main image index if needed
    if (index === mainImageIndex) {
      setMainImageIndex(updatedFiles.length > 0 ? 0 : -1)
    } else if (index < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1)
    }
  }

  // Set an image as the main image
  const setAsMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  // Function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result
        if (typeof result === "string") {
          // Return the full Data URL, including the prefix
          resolve(result)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }

      reader.onerror = () => {
        reject(new Error("Error reading file"))
      }

      reader.readAsDataURL(file)
    })
  }

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Prepare the payload based on the book state
      const payload: any = { ...book }

      // Process images if any are selected
      if (imageFiles.length > 0) {
        payload.imageList = []

        // Convert each image to base64 and add to the payload
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const base64Data = await fileToBase64(file)

          payload.imageList.push({
            name: file.name,
            isIcon: i === mainImageIndex, // Set as icon if it's the main image
            link: "",
            dataImage: base64Data,
          })
        }
      }

      const response = await fetch("http://localhost:8080/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create book")
      }

      window.alert("Book added successfully")

      // Navigate to the book list page
      navigate("/admin/books")
    } catch (error) {
      console.error("Error adding book:", error)
      window.alert("Error adding book")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="book-form-container">
      <h2 className="form-title">Add New Book</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="book_name">Name of the book</label>
              <input
                type="text"
                className="form-control"
                value={book.name}
                onChange={(e) => setBook({ ...book, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book_price_origin">Price origin</label>
              <input
                type="number"
                className="form-control"
                value={book.priceOrigin}
                onChange={(e) => setBook({ ...book, priceOrigin: Number.parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book_price_sell">Price sell</label>
              <input
                type="number"
                className="form-control"
                value={book.priceSell}
                onChange={(e) => setBook({ ...book, priceSell: Number.parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book_author">Author</label>
              <input
                type="text"
                className="form-control"
                value={book.author}
                onChange={(e) => setBook({ ...book, author: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book_isbn">ISBN</label>
              <input
                type="text"
                className="form-control"
                value={book.isbn}
                onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label htmlFor="book_description">Description</label>
              <textarea
                className="form-control description-input"
                value={book.description}
                onChange={(e) => setBook({ ...book, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book_quantity">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={book.quantity}
                onChange={(e) => setBook({ ...book, quantity: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="form-group image-upload-container">
              <label htmlFor="book_image">Book Cover Images</label>
              <input
                type="file"
                id="book_image"
                className="form-control file-input"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />

              {/* Display selected images */}
              {imagePreviews.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2">Selected Images:</p>
                  <div className="row">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <div
                          className={`image-preview-container border p-2 ${
                            index === mainImageIndex ? "border-primary" : ""
                          }`}
                        >
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Book cover preview ${index + 1}`}
                            className="image-preview mb-2"
                          />
                          <div className="d-flex justify-content-between">
                            <button
                              type="button"
                              className={`btn ${
                                index === mainImageIndex ? "btn-primary" : "btn-outline-primary"
                              } btn-sm`}
                              onClick={() => setAsMainImage(index)}
                              disabled={index === mainImageIndex}
                            >
                              {index === mainImageIndex ? "Main Image" : "Set as Main"}
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeImage(index)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary me-2" onClick={() => navigate("/admin/books")}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  )
}

const BookForm_Admin = RequireAdmin(BookForm)
export default BookForm_Admin


"use client"

import type React from "react"
import { type FormEvent, useState, type ChangeEvent, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../../css/BookForm.css"
import RequireAdmin from "./RequireAdmin"
import { findBookById } from "../../api/BookAPI"
import { getAllImagesOfABook } from "../../api/ImageAPI"

const BookUpdateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  console.log(id);
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
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch book data when component mounts
  useEffect(() => {
    if (id) {
      const bookId = Number.parseInt(id)
      fetchBookData(bookId)
    } else {
      setError("No book ID provided")
      setLoading(false)
    }
  }, [id])

  // Fetch book data and images
  const fetchBookData = async (bookId: number) => {
    try {
      setLoading(true)
      // Fetch book details
      const bookData = await findBookById(bookId)
      if (bookData) {
        setBook({
          id: bookData.id,
          name: bookData.name || "",
          author: bookData.author || "",
          isbn: bookData.isbn || "",
          description: bookData.description || "",
          priceOrigin: bookData.priceOrigin || 0,
          priceSell: bookData.priceSell || 0,
          quantity: bookData.quantity || 0,
          rating: bookData.rating || 0,
        })
      } else {
        throw new Error("Book not found")
      }

      // Fetch book images
      const images = await getAllImagesOfABook(bookId)
      setExistingImages(images)

      // Find the main image (icon)
      const mainImageIdx = images.findIndex((img) => img.isIcon === true)
      if (mainImageIdx !== -1) {
        setMainImageIndex(mainImageIdx)
      }

      setLoading(false)
    } catch (err) {
      console.error("Error fetching book data:", err)
      setError("Failed to load book data")
      setLoading(false)
    }
  }

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
    }
  }

  // Remove a new image
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
    if (existingImages.length + index === mainImageIndex) {
      setMainImageIndex(existingImages.length > 0 ? 0 : updatedFiles.length > 0 ? existingImages.length : -1)
    } else if (existingImages.length + index < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1)
    }
  }

  // Remove an existing image
  const removeExistingImage = async (index: number) => {
    try {
      const imageToRemove = existingImages[index]

      // In a real application, you would make an API call to delete the image
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Only attempt to delete if we have an image ID
      if (imageToRemove.id) {
        const response = await fetch(`http://localhost:8080/api/images/${imageToRemove.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to delete image")
        }
      }

      // Update the UI
      const updatedExistingImages = [...existingImages]
      updatedExistingImages.splice(index, 1)
      setExistingImages(updatedExistingImages)

      // Adjust main image index if needed
      if (index === mainImageIndex) {
        setMainImageIndex(
          updatedExistingImages.length > 0 ? 0 : imageFiles.length > 0 ? updatedExistingImages.length : -1,
        )
      } else if (index < mainImageIndex) {
        setMainImageIndex(mainImageIndex - 1)
      }
    } catch (error) {
      console.error("Error removing image:", error)
      alert("Failed to remove image. Please try again.")
    }
  }

  // Set an image as the main image
  const setAsMainImage = (index: number, isExisting = false) => {
    if (isExisting) {
      setMainImageIndex(index)
    } else {
      setMainImageIndex(existingImages.length + index)
    }
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

      // Process images for the payload
      payload.imageList = []

      // Add existing images to the payload, marking which one is the icon
      existingImages.forEach((img, index) => {
        payload.imageList.push({
          id: img.id,
          name: img.name,
          icon: index === mainImageIndex,
          link: img.link,
          dataImage: img.dataImage,
        })
      })

      // Process new images if any are selected
      if (imageFiles.length > 0) {
        // Convert each new image to base64 and add to the payload
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const base64Data = await fileToBase64(file)

          payload.imageList.push({
            name: file.name,
            icon: existingImages.length + i === mainImageIndex, // Set as icon if it's the main image
            link: "",
            dataImage: base64Data,
          })
        }
      }

      const response = await fetch(`http://localhost:8080/api/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed with status: ${response.status}, Error: ${errorText}`);
        throw new Error(`Failed to update book: ${response.status} ${errorText}`);
      }

      window.alert("Book updated successfully")

      // Navigate to the book list page
      navigate("/admin/books")
    } catch (error) {
      console.error("Error updating book:", error)
      window.alert("Error updating book")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading book data...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/admin/books")}>
          Back to Book List
        </button>
      </div>
    )
  }

  return (
    <div className="book-form-container">
      <h2 className="form-title">Update Book Information</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-left">
            <input type="hidden" id="book_id" value={book.id} />

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

              {/* Display existing images */}
              {existingImages.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2">Existing Images:</p>
                  <div className="row">
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} className="col-md-4 mb-3">
                        <div
                          className={`image-preview-container border p-2 ${
                            index === mainImageIndex ? "border-primary" : ""
                          }`}
                        >
                          <img
                            src={img.dataImage || "/placeholder.svg"}
                            alt={`Book cover ${index + 1}`}
                            className="image-preview mb-2"
                          />
                          <div className="d-flex justify-content-between">
                            <button
                              type="button"
                              className={`btn ${
                                index === mainImageIndex ? "btn-primary" : "btn-outline-primary"
                              } btn-sm`}
                              onClick={() => setAsMainImage(index, true)}
                              disabled={index === mainImageIndex}
                            >
                              {index === mainImageIndex ? "Main Image" : "Set as Main"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeExistingImage(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display new images */}
              {imagePreviews.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2">New Images:</p>
                  <div className="row">
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="col-md-4 mb-3">
                        <div
                          className={`image-preview-container border p-2 ${
                            existingImages.length + index === mainImageIndex ? "border-primary" : ""
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
                                existingImages.length + index === mainImageIndex ? "btn-primary" : "btn-outline-primary"
                              } btn-sm`}
                              onClick={() => setAsMainImage(index)}
                              disabled={existingImages.length + index === mainImageIndex}
                            >
                              {existingImages.length + index === mainImageIndex ? "Main Image" : "Set as Main"}
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
            {isSubmitting ? "Updating..." : "Update Book"}
          </button>
        </div>
      </form>
    </div>
  )
}

const BookUpdateForm_Admin = RequireAdmin(BookUpdateForm)
export default BookUpdateForm_Admin


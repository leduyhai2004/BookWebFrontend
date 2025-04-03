
import type React from "react"
import { type FormEvent, useState, type ChangeEvent } from "react"
import "../../css/BookForm.css"
import RequireAdmin from "./RequireAdmin"

const BookForm: React.FC = (props) => {
  const [book, setBook] = useState({
    id: 0,
    name: "",
    author: "",
    ISBN: "",
    description: "",
    priceOrigin: 0,
    priceSell: 0,
    quantity: 0,
    rating: 0,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImageFile(file)
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }
      // Create FormData to handle file upload
      const formData = new FormData()

      // Add all book properties to FormData
      formData.append("id", book.id.toString())
      formData.append("name", book.name)
      formData.append("author", book.author)
      formData.append("ISBN", book.ISBN)
      formData.append("description", book.description)
      formData.append("priceOrigin", book.priceOrigin.toString())
      formData.append("priceSell", book.priceSell.toString())
      formData.append("quantity", book.quantity.toString())
      formData.append("rating", book.rating.toString())
  
      if (imageFile) {
        formData.append("image", imageFile)
      }
  
      console.log("Form submitted with image:", imageFile?.name)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/books',{
        method : "POST",
        headers :{
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify(book)
    }).then((response)=>{
        if(response.ok){
            window.alert("Add boo successful");
            setBook({
                id: 0,
                name: "",
                author: "",
                ISBN: "",
                description: "",
                priceOrigin: 0,
                priceSell: 0,
                quantity: 0,
                rating: 0,
            })
        }else{
            window.alert("Error add book");
            console.log("Sai o cho response BookForm")
        }
    })

  }

  return (
    <div className="book-form-container">
      <h2 className="form-title">Add New Book</h2>
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
                value={book.ISBN}
                onChange={(e) => setBook({ ...book, ISBN: e.target.value })}
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
{/* 
            <div className="form-group">
              <label htmlFor="book_rating">Rating (0-5)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                max="5"
                step="0.1"
                value={book.rating}
                onChange={(e) => setBook({ ...book, rating: Number.parseFloat(e.target.value) })}
                required
              />
            </div> */}

            <div className="form-group image-upload-container">
              <label htmlFor="book_image">Book Cover Image</label>
              <input
                type="file"
                id="book_image"
                className="form-control file-input"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview || "/placeholder.svg"} alt="Book cover preview" className="image-preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Book
          </button>
        </div>
      </form>
    </div>
  )
}
const BookForm_Admin = RequireAdmin(BookForm);
export default BookForm_Admin


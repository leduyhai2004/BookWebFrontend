
import type React from "react"
import { type FormEvent, useState, type ChangeEvent } from "react"
import "../../css/BookForm.css"
import RequireAdmin from "./RequireAdmin"

const BookForm: React.FC = (props) => {
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImageFile(file)
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

    // Function to convert File to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") {
            // Return the full Data URL, including the prefix
            resolve(result);
          } else {
            reject(new Error("Failed to convert file to base64"));
          }
        };
    
        reader.onerror = () => {
          reject(new Error("Error reading file"));
        };
    
        reader.readAsDataURL(file);
      });
    };
  
      console.log("Form submitted with image:", imageFile?.name)

      const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
    
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error("Authentication required");
          }
          // Prepare the payload based on the book state.
          // If an image file is selected, convert it and add it to the payload's imageList.
          const payload: any = { ...book };
          if (imageFile) {
            const base64Data = await fileToBase64(imageFile);
            payload.imageList = [
              {
                name: imageFile.name,
                icon: true, // if this is the main icon image
                link: "",
                dataImage: base64Data,
                // No need to add the book reference; the backend will set it.
              },
            ];
          }
          const response = await fetch("http://localhost:8080/api/books", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            throw new Error("Failed to create book");
          }
    
          window.alert("Book added successfully");
          // Reset the form state on success
          setBook({
            id: 0,
            name: "",
            author: "",
            isbn: "",
            description: "",
            priceOrigin: 0,
            priceSell: 0,
            quantity: 0,
            rating: 0,
          });
          setImageFile(null);
          setImagePreview(null);
        } catch (error) {
          console.error("Error adding book:", error);
          window.alert("Error adding book");
        } finally {
          setIsSubmitting(false);
        }
      };

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


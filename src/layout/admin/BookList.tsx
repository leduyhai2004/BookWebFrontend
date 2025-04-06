"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import RequireAdmin from "./RequireAdmin"
import type Book from "../../models/Book"
import { getAllBooks } from "../../api/BookAPI"
import { Eye, Pencil, Trash } from "react-bootstrap-icons"
import FormatNumber from "../utils/FormatNumber"
import { Pagination } from "../utils/Pagination"

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  // Fetch books from API
  useEffect(() => {
    fetchBooks()
  }, [currentPage, sortField, sortDirection])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const result = await getAllBooks(currentPage - 1)
      setBooks(result.result)
      setTotalPages(result.totalPages)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching books:", err)
      setError("Failed to load books. Please try again.")
      setLoading(false)
    }
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset to first page when searching
    setCurrentPage(1)
    // Implement search functionality here
    // This would typically call a different API endpoint with the search term
    console.log("Searching for:", searchTerm)
  }

  // Handle delete book
  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setIsDeleting(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to delete book")
        }

        // Refresh the book list
        fetchBooks()
        alert("Book deleted successfully")
      } catch (error) {
        console.error("Error deleting book:", error)
        alert("Error deleting book")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Handle edit book
  const handleEditBook = (bookId: number) => {
    navigate(`/admin/book-form/${bookId}`)
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading books...</p>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={fetchBooks}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Book Management</h2>
        <Link to="/admin/book-form" className="btn btn-primary">
          Add New Book
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="submit">
            Search
          </button>
        </div>
      </form>

      {/* Books Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("author")} style={{ cursor: "pointer" }}>
                Author {sortField === "author" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("priceSell")} style={{ cursor: "pointer" }}>
                Price {sortField === "priceSell" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("quantity")} style={{ cursor: "pointer" }}>
                Quantity {sortField === "quantity" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>{FormatNumber(book.priceSell)} VND</td>
                  <td>{book.quantity}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/books/${book.id}`} className="btn btn-sm btn-info me-1" title="View">
                        <Eye />
                      </Link>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => handleEditBook(book.id)}
                        title="Edit"
                      >
                        <Pencil />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteBook(book.id)}
                        disabled={isDeleting}
                        title="Delete"
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Pagination nowPage={currentPage} totalPages={totalPages} pagination={handlePageChange} />
      </div>
    </div>
  )
}

const BookList_Admin = RequireAdmin(BookList)
export default BookList_Admin


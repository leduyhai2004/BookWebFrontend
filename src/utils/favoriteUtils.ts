import type Book from "../models/Book"

// Define a more flexible book interface to handle different API response structures
interface FavoriteBook extends Partial<Book> {
  id?: number
  bookId?: number // Alternative ID field that might be in the API response
  book_id?: number // Another possible ID field
}

// Add a book to favorites using the API
export const addToFavorites = async (bookId: number): Promise<boolean> => {
  try {
    // Validate bookId
    if (bookId === undefined || bookId === null || isNaN(bookId)) {
      console.error("Invalid bookId:", bookId)
      return false
    }

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    console.log(`Adding book to favorites with ID: ${bookId}`)

    const response = await fetch(`http://localhost:8080/api/favourite-books/add/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to add to favorites: ${response.status} ${errorText}`)
      throw new Error("Failed to add book to favorites")
    }

    // Dispatch custom event to notify components about favorites update
    window.dispatchEvent(new Event("favoritesUpdated"))
    return true
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return false
  }
}

// Get all favorite books from the API
export const getFavorites = async (): Promise<FavoriteBook[]> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch("http://localhost:8080/api/favourite-books/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch favorites: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch favorites")
    }

    const data = await response.json()
    console.log("Raw API response for favorites:", data)

    // Handle different possible response structures
    let books: FavoriteBook[] = []

    if (Array.isArray(data)) {
      // If the response is already an array
      books = data
    } else if (data._embedded && Array.isArray(data._embedded.books)) {
      // If the response has an _embedded.books structure (common in Spring HATEOAS)
      books = data._embedded.books
    } else if (data.content && Array.isArray(data.content)) {
      // If the response has a content array (common in Spring pagination)
      books = data.content
    } else {
      // If we can't determine the structure, log it and return an empty array
      console.error("Unexpected API response structure:", data)
      return []
    }

    console.log("Processed favorites from API:", books)
    return books
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return []
  }
}

// Remove a book from favorites - Updated to use the correct endpoint
export const removeFromFavorites = async (bookId: number): Promise<boolean> => {
  try {
    // Validate bookId
    if (bookId === undefined || bookId === null || isNaN(bookId)) {
      console.error("Invalid bookId:", bookId)
      return false
    }

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    // Log the request for debugging
    console.log(`Removing book from favorites with ID: ${bookId}`)

    // Updated endpoint as requested
    const response = await fetch(`http://localhost:8080/api/favourite-books/remove-favourite/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to remove from favorites: ${response.status} ${errorText}`)
      throw new Error("Failed to remove book from favorites")
    }

    // Dispatch custom event to notify components about favorites update
    window.dispatchEvent(new Event("favoritesUpdated"))
    return true
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return false
  }
}

// Check if a book is in favorites
export const isInFavorites = async (bookId: number): Promise<boolean> => {
  try {
    if (bookId === undefined || bookId === null || isNaN(bookId)) {
      console.error("Invalid bookId for isInFavorites check:", bookId)
      return false
    }

    const favorites = await getFavorites()
    return favorites.some((book) => {
      // Check all possible ID fields
      const bookIdFromAPI = book.id || book.bookId || book.book_id
      return Number(bookIdFromAPI) === Number(bookId)
    })
  } catch (error) {
    console.error("Error checking favorites:", error)
    return false
  }
}

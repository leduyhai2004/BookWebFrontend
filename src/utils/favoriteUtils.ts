import type { FavoriteItem } from "../models/CartItem"
import type Book from "../models/Book"

// Get favorites from localStorage
export const getFavorites = (): FavoriteItem[] => {
  const favoritesJson = localStorage.getItem("favorites")
  return favoritesJson ? JSON.parse(favoritesJson) : []
}

// Save favorites to localStorage
export const saveFavorites = (favorites: FavoriteItem[]): void => {
  localStorage.setItem("favorites", JSON.stringify(favorites))
  // Dispatch custom event to notify components about favorites update
  window.dispatchEvent(new Event("favoritesUpdated"))
}

// Add item to favorites
export const addToFavorites = (book: Book): void => {
  const favorites = getFavorites()
  const existingItem = favorites.find((item) => item.bookId === book.id)

  if (!existingItem) {
    favorites.push({
      bookId: book.id,
      book: book,
    })
    saveFavorites(favorites)
  }
}

// Remove item from favorites
export const removeFromFavorites = (bookId: number): void => {
  const favorites = getFavorites()
  const updatedFavorites = favorites.filter((item) => item.bookId !== bookId)
  saveFavorites(updatedFavorites)
}

// Check if item is in favorites
export const isInFavorites = (bookId: number): boolean => {
  const favorites = getFavorites()
  return favorites.some((item) => item.bookId === bookId)
}

// Get favorites count
export const getFavoritesCount = (): number => {
  const favorites = getFavorites()
  return favorites.length
}


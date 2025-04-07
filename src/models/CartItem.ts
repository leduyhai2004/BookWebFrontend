import type Book from "./Book"

export interface CartItem {
  bookId: number
  quantity: number
  book: Book
}

export interface FavoriteItem {
  bookId: number
  book: Book
}


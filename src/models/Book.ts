class Book {
    id: number
    name?: string // co the bi null
    author?: string
    isbn?: string
    description?: string
    priceOrigin?: number
    priceSell?: number
    quantity?: number
    rating?: number
    imageURL?: string // Add this new property
  
    constructor(
      id: number,
      name?: string, // co the bi null
      author?: string,
      isbn?: string,
      description?: string,
      priceOrigin?: number,
      priceSell?: number,
      quantity?: number,
      rating?: number,
      imageURL?: string,
    ) {
      this.id = id
      this.name = name
      this.author = author
      this.isbn = isbn
      this.description = description
      this.priceOrigin = priceOrigin
      this.priceSell = priceSell
      this.quantity = quantity
      this.rating = rating
      this.imageURL = imageURL
    }
  }
  export default Book
  
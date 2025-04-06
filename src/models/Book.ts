class Book{
    id : number;
    name?: string; // co the bi null
    author?: string;
    isbn?: string;
    description?: string;
    priceOrigin?: number;
    priceSell?: number;
    quantity?: number;
    rating?: number;

    constructor(
        id : number,
        name?: string, // co the bi null
        author?: string,
        isbn?: string,
        description?: string,
        priceOrigin?: number,
        priceSell?: number,
        quantity?: number,
        rating?: number,
    ){
        this.id = id;
        this.name = name;
        this.author = author;
        this.isbn = isbn;
        this.description = description;
        this.priceOrigin = priceOrigin;
        this.priceSell = priceSell;
        this.quantity = quantity;
        this.rating = rating;
    }

}
export default Book;
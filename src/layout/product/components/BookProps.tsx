import React from "react";
import Book from "../../../models/Book";

interface BookProps{
    book : Book;
}
 const BookProps : React.FC<BookProps> = (props) =>{
    return(
        <div className="col-md-3 mt-2">
            <div className="card">
                <img src={""} className="card-img-top" alt={props.book.author} style={{height:'200px'}} />
                <div className="card-body">
                    <h5 className="card-title">{props.book.name}</h5>
                    <p className="card-text">{props.book.description}</p>
                    <div className="price">
                        <span className="original-price">
                            <del>{props.book.priceOrigin}</del>
                        </span>
                        <span className="discounted-price">
                            <strong>{props.book.priceSell}</strong>
                        </span>
                    </div>
                    <div className="row mt-2" role="group">
                        <div className="col-6">
                            <a href="#" className="btn btn-secondary btn-block">
                                <i className="fas fa-heart"></i>
                            </a>
                        </div>
                        <div className="col-6">
                            <a href="#" className="btn btn-danger btn-block">
                                <i className="fas fa-shopping-cart"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
 }
 export default BookProps;
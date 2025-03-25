import React from "react";
import Book from "../../../models/Book";
import { useEffect,useState } from "react";
import Image from "../../../models/Image";
import { getAllImagesOfABook, getOneImageOfABook } from "../../../api/ImageAPI";

interface BookPropsInterface{
    book : Book;
}
 const BookProps : React.FC<BookPropsInterface> = (props) =>{
    
    const book_id : number = props.book.id;
    const [listImage, setListImage] = useState<Image[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);
    
        useEffect(()=>{
            getAllImagesOfABook(book_id).then(
                imageData =>{
                    setListImage(imageData)
                    setLoading(false);
                }
            ).catch(
                error =>{
                    setError(error);
                }
            );
        },[])

        if(loading){
            return(
                <div>
                    <h1>The Page is loading ...</h1>
                </div>
            );
        }
    
        if(error){
            return(
                <div>
                    <h1>It has error: ${error}</h1>
                </div>
            );
        }
    
    return(
        <div className="col-md-3 mt-2">
            <div className="card">
                { listImage[0] && listImage[0].dataImage && <img src={`${listImage[0].dataImage}`}
                 className="card-img-top"
                  alt={props.book.author}
                   style={{height:'200px'}} />
                }

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
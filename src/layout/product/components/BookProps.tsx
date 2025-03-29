import React from "react";
import Book from "../../../models/Book";
import { useEffect,useState } from "react";
import Image from "../../../models/Image";
import { getAllImagesOfABook, getOneImageOfABook } from "../../../api/ImageAPI";
import { Link } from "react-router-dom";
import renderRating from './../../utils/RenderStar';

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
    let dataImage : string = "";
    if(listImage[0] && listImage[0].dataImage){
        dataImage = listImage[0].dataImage;
    }
    return(
        <div className="col-md-3 mt-2">
            <div className="card">
            <Link to={`/books/${props.book.id}`}>
                <img src={dataImage} className="card-img-top" alt={props.book.name} style={{ height: "200px" }} />
            </Link>


                <div className="card-body">
                    <Link  to={`/books/${props.book.id}`} style={{textDecoration:'none'}}>
                        <h5 className="card-title">{props.book.name}</h5>
                    </Link>
                    
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
                            {renderRating(props.book.rating ? props.book.rating:0)}
                        </div>
                            <div className="col-6 text-end">
                                <a href="#" className="btn btn-secondary btn-block me-2">
                                    <i className="fas fa-heart"></i>
                                </a>
                            
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
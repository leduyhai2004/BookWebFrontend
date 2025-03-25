import React from "react";
import Book from "../../../models/Book";
import { useEffect,useState } from "react";
import Image from "../../../models/Image";
import { getOneImageOfABook } from "../../../api/ImageAPI";

interface CarouselItemInterface{
    book : Book;
}
 const CarouselItem : React.FC<CarouselItemInterface> = (props) =>{
    
    const book_id : number = props.book.id;
    const [listImage, setListImage] = useState<Image[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);
    
        useEffect(()=>{
            getOneImageOfABook(book_id).then(
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
        <div className="row align-items-center">
        <div className="col-5 text-center">
            {listImage[0] && listImage[0].dataImage && <img src={`${listImage[0].dataImage}`} className="float-end"  style={{width:'300px'}}/>}
        </div>
        <div className="col-7">
            <h5>{props.book.name}</h5>
            <p>{props.book.description}</p>
        </div>
        </div>
    );
 }
 export default CarouselItem;
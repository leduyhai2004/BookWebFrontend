import React from "react";
import { useEffect,useState } from "react";
import Image from "../../../models/Image";
import { getAllImagesOfABook, getOneImageOfABook } from "../../../api/ImageAPI";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


interface BookImageInterface{
    book_id : number;
}
 const BookImage : React.FC<BookImageInterface> = (props) =>{
    
    const book_id : number = props.book_id;
    const [listImage, setListImage] = useState<Image[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);

    
        useEffect(()=>{
            getAllImagesOfABook(book_id).then(
                danhSach =>{
                    setListImage(danhSach)
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
    // let dataImage : string = "";
    // if(listImage[0] && listImage[0].dataImage){
    //     dataImage = listImage[0].dataImage;
    // }
    return(
        <div className="row">
            <div className="col-12">
                <Carousel showArrows={true} showIndicators={true}>
                    {
                        listImage.map((image,index)=>(
                            <div key={index}>
                                <img src={image.dataImage} alt={image.name} style={{maxWidth:'200px'}} />
                            </div>
                        ))
                    }
                </Carousel>
            </div>
        </div>
    );
 }
 export default BookImage;
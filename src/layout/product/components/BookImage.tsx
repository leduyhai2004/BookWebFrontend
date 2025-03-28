import React from "react";
import { useEffect,useState } from "react";
import Image from "../../../models/Image";
import { getAllImagesOfABook, getOneImageOfABook } from "../../../api/ImageAPI";
import { Carousel } from "react-responsive-carousel";

interface BookImageInterface{
    book_id : number;
}
 const BookImage : React.FC<BookImageInterface> = (props) =>{
    
    const book_id : number = props.book_id;
    const [listImage, setListImage] = useState<Image[]>([]);
    const [choosenImage, setChoosenImage] = useState<Image|null>(null);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);

    const chooseImage = (image : Image) =>{
        setChoosenImage(image);
    }
    
        useEffect(()=>{
            getAllImagesOfABook(book_id).then(
                danhSach =>{
                    setListImage(danhSach)
                    if(danhSach.length){
                        setChoosenImage(danhSach[0]);
                    }
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
        <div className="">
            <div >
                {(choosenImage) && <img src={choosenImage.dataImage} style={{height:'400px', width:'400px'}}/>}
            </div>
            <div className="row mt-4">
                
                    {
                        listImage.map((image,index) => (
                            <div className="col-3" key={index} onClick={()=>chooseImage(image)}>
                                {(image) && <img src={image.dataImage} style={{width:'50px'}}/>}
                            </div>
                         ) )
                    }
                
            </div>
        </div>
    );
 }
 export default BookImage;
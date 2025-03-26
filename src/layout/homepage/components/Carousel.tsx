import React, { useEffect, useState } from "react";
import BookProps from "../../product/components/BookProps";
import Book from "../../../models/Book";
import { getThreeNewestBook } from "../../../api/BookAPI";
import { error } from "console";
import CarouselItem from "./CarouselItem";


const Carousel: React.FC = () =>{
    const [listBook, setListBook] = useState<Book[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);

    useEffect(()=>{
        getThreeNewestBook().then(
            kq =>{
                setListBook(kq.result)
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
        <div id="carouselExampleCaptions" className="carousel carousel-dark slide">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                <CarouselItem key={0} book={listBook[0]}/>
                </div>

                <div className="carousel-item">
                <CarouselItem key={1} book={listBook[1]}/>
                </div>

                <div className="carousel-item">
                <CarouselItem key={2} book={listBook[2]}/>
                </div>
            </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
        </div>
    );
}
export default Carousel;
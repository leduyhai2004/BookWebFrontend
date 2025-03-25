import React from "react";
function Carousel(){
    return(
        <div id="carouselExampleCaptions" className="carousel carousel-dark slide">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <div className="row align-items-center">
                    <div className="col-5 text-center">
                        <img className="float-end" src={'./../../../images/books/1.webp'}  style={{width:'300px'}}/>
                    </div>
                    <div className="col-7">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                    </div>
                </div>
                <div className="carousel-item">
                <div className="row align-items-center">
                    <div className="col-5 text-center">
                        <img className="float-end" src={'./../../../images/books/2.webp'}  style={{width:'300px'}}/>
                    </div>
                    <div className="col-7">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                    </div>
                </div>
                <div className="carousel-item">
                <div className="row align-items-center">
                    <div className="col-5 text-center">
                        <img className="float-end" src={'./../../../images/books/3.jpg'}  style={{width:'300px'}}/>
                    </div>
                    <div className="col-7">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                    </div>
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
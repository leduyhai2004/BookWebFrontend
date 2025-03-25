import React from "react";
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import ListBook from "../product/ListBook";

function HomePage(){
    return(
        <div>
            <Banner/>
            <Carousel/>
            <ListBook/>
        </div>
    );
}
export default HomePage;
import React from "react";
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import ListBook from "../product/ListBook";


interface HomePageProp{
    searchKey : string;
}
function HomePage({searchKey} : HomePageProp){
    return(
        <div>
            <Banner/>
            <Carousel/>
            <ListBook searchKey={searchKey}/>
        </div>
    );
}
export default HomePage;
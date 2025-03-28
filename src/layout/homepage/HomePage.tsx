import React from "react";
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import ListBook from "../product/ListBook";
import { useParams } from "react-router-dom";


interface HomePageProp{
    searchKey : string;
}
function HomePage({searchKey} : HomePageProp){
    const {type_id} = useParams();
    let type_id_number = 0;
    try {
        type_id_number = parseInt(type_id +''); //NaN: khong xac dinh
    } catch (error) {
        type_id_number = 0;
        console.log(error,"error at type_id")
    }
    if(Number.isNaN(type_id_number)){
        type_id_number = 0;
    }
    return(
        <div>
            <Banner/>
            <Carousel/>
            <ListBook searchKey={searchKey} type_id = {type_id_number}/>
        </div>
    );
}
export default HomePage;
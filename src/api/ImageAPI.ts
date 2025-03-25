import React from "react";
import Image from "../models/Image";
import { MyRequest } from "./MyRequest";


export async function getImageOfABook( duongDan : string) :  Promise<Image[]> {
    const result : Image[] = [];
    //xac dinh endpoint

    // goi phuong thuc reqest
    const response = await MyRequest(duongDan);

    //lay ra json sach
    console.log(response);
    //lay ra json sach
    const responseData = response._embedded.images;
    //lay tung sach 1
    for(const key in responseData){
        result.push({
            id : responseData[key].id,
            name : responseData[key].name,
            isIcon : responseData[key].isIcon,
            link : responseData[key].link,
            dataImage : responseData[key].dataImage,
        });
    }
    return result;
}

export async function getOneImageOfABook(book_id : number) : Promise<Image[]>{
    const duongDan : string = `http://localhost:8080/books/${book_id}/imageList?sort=id,asc&page=0&size=1`;
    return getImageOfABook(duongDan);
}
export async function getAllImagesOfABook(book_id : number) : Promise<Image[]>{
    const duongDan : string = `http://localhost:8080/books/${book_id}/imageList`;
    return getImageOfABook(duongDan);
}


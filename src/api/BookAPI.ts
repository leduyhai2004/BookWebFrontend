import React from "react";
import Book from "../models/Book";
import { MyRequest } from "./MyRequest";


export async function getBooks(duongDan:string): Promise<Book[]> {
    const result : Book[] = [];
    //xac dinh endpoint
    
    // goi phuong thuc reqest
    const response = await MyRequest(duongDan);

    //lay ra json sach
    console.log(response);
    //lay ra json sach
    const responseData = response._embedded.books;
    //lay tung sach 1
    for(const key in responseData){
        result.push({
            id : responseData[key].id,
            name: responseData[key].name,
            author: responseData[key].author,
            ISBN: responseData[key].ISBN,
            description: responseData[key].description,
            priceOrigin: responseData[key].priceOrigin,
            priceSell: responseData[key].priceSell,
            quantity: responseData[key].quantity,
            rating: responseData[key].rating,
        });
    }
    return result;
}


export async function getAllBooks() : Promise<Book[]>{
    const duongDan : string = 'http://localhost:8080/books?sort=id,desc';
    return getBooks(duongDan)
}

export async function getThreeNewestBook() : Promise<Book[]>{
    const duongDan : string = 'http://localhost:8080/books?sort=id,desc&page=0&size=3';
    return getBooks(duongDan)
}
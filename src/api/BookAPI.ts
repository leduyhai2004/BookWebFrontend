import React from "react";
import Book from "../models/Book";

async function request(duongDan : string) {
    // truy van den duong dan
    const response = await fetch(duongDan);
    if(!response.ok){
        throw new Error(`Can not access ${duongDan}`)
    }
    // neu ok
    return response.json();
}

export async function getAllBooks() : Promise<Book[]>{
    const result : Book[] = [];
    //xac dinh endpoint
    const duongDan : string = 'http://localhost:8080/books';
    // goi phuong thuc reqest
    const response = await request(duongDan);

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
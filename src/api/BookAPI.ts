import React from "react";
import Book from "../models/Book";
import { MyRequest } from "./MyRequest";

interface ResultInterface{
    result : Book[];
    totalPages : number;
    // size : number; // so luong sach tren 1 trang
    totalElements : number;
}
export async function getBooks(duongDan:string): Promise<ResultInterface> {
    const result : Book[] = [];
    //xac dinh endpoint
    
    // goi phuong thuc reqest
    const response = await MyRequest(duongDan);

    //lay ra json sach
    console.log(response);
    //lay ra json sach
    const responseData = response._embedded.books;
    //lay thong tin trang
    const totalPages : number = response.page.totalPages;
    const totalBooks : number = response.page.totalElements;

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
    return {result : result, totalPages : totalPages, totalElements : totalBooks};
}


export async function getAllBooks(nowPage : number) : Promise<ResultInterface>{
    const duongDan : string = `http://localhost:8080/books?sort=id,desc&size=8&page=${nowPage}`;
    return getBooks(duongDan)
}

export async function getThreeNewestBook() : Promise<ResultInterface>{
    const duongDan : string = 'http://localhost:8080/books?sort=id,desc&page=0&size=3';
    return getBooks(duongDan)
}
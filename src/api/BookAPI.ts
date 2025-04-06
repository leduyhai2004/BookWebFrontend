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
            isbn: responseData[key].isbn,
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

export async function findBookBySearchKey(searchKey : string, type_id : number) : Promise<ResultInterface>{
    let duongDan : string = `http://localhost:8080/books?sort=id,desc&size=8&page=0`
    const duongDan2 : string = `http://localhost:8080/books/search/findByNameContainingIgnoreCase?sort=id,desc&size=8&page=0&name=${searchKey}`;

    if(searchKey !== '' && type_id ===0){
        duongDan = duongDan2;
    }else if(searchKey === '' && type_id > 0){
        duongDan = `http://localhost:8080/books/search/findByTypeList_Id?sort=id,desc&size=8&page=0&type_id=${type_id}`;
    }else{
        duongDan = `http://localhost:8080/books/search/findByNameContainingIgnoreCaseAndTypeList_Id?sort=id,desc&size=8&page=0&name=${searchKey}&type_id=${type_id}`
    }
    return getBooks(duongDan)
}
export async function findBookById(id : number) : Promise<Book|null>{
    let duongDan : string = `http://localhost:8080/books/${id}`
    let result : Book;
    try {
    // goi phuong thuc reqest
    const response = await fetch(duongDan);
        if(!response.ok){
            throw new Error("Error in processing call api")
        }
    const bookData = await response.json();
    if(bookData){
        return{
            id : bookData.id,
            name: bookData.name,
            author: bookData.author,
            isbn: bookData.isbn,
            description: bookData.description,
            priceOrigin: bookData.priceOrigin,
            priceSell: bookData.priceSell,
            quantity: bookData.quantity,
            rating: bookData.rating,
        }
    }else{
        throw new Error("Non existed Book!");
    }
    } catch (error) {
        console.log(error);
        return null;
    }

}

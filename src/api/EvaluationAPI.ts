import React from "react";
import { MyRequest } from "./MyRequest";
import Evaluation from "../models/Evaluation";
import User from "../models/User";

export async function getEvaluationOfABook( duongDan : string) :  Promise<Evaluation[]> {
    const result : Evaluation[] = [];
    //xac dinh endpoint

    // goi phuong thuc reqest
    const response = await MyRequest(duongDan);

    //lay ra json sach
    console.log(response);
    //lay ra json sach
    const responseData = response._embedded.ratings;
    //lay tung sach 1
    for(const key in responseData){
        result.push({
            id : responseData[key].id,
            ratingMark : responseData[key].ratingMark,
            comment : responseData[key].comment,
            user_id : 0,
            book_id : 0
        });
    }
    return result;
}
export async function getUserOfAEvaluationOfABook( duongDan : string) :  Promise<User[]> {
    const result : User[] = [];
    //xac dinh endpoint

    // goi phuong thuc reqest
    const response = await MyRequest(duongDan);

    //lay tung sach 1
    for(const key in response){
        result.push({
            id : response[key].id,
            username : response[key].username,
        });
    }
    return result;
}

export async function getOneEvaluationOfABook(book_id : number) : Promise<Evaluation[]>{
    const duongDan : string = `http://localhost:8080/books/${book_id}/ratingListHistory?sort=id,asc&page=0&size=1`;
    return getEvaluationOfABook(duongDan);
}
export async function getAllEvaluationsOfABook(book_id : number) : Promise<Evaluation[]>{
    const duongDan : string = `http://localhost:8080/books/${book_id}/ratingListHistory`;
    return getEvaluationOfABook(duongDan);
}

export async function getUserByEvaluation(book_id : number) : Promise<Evaluation[]>{
    const duongDan : string = `http://localhost:8080/ratings/${book_id}/user`;
    return getUserOfAEvaluationOfABook(duongDan);
}


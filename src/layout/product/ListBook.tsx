import React, { useEffect, useState } from "react";
import BookProps from "./components/BookProps";
import Book from "../../models/Book";
import { getAllBooks } from "../../api/BookAPI";
import { error } from "console";
import { Pagination } from "../utils/Pagination";

const ListBook : React.FC = () =>{
    const [listBook, setListBook] = useState<Book[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);
    const[nowPage,setNowPage] = useState(1);
    const[totalPages,setTotalPages] = useState(0);

    const pagination = (page : number) =>{
        setNowPage(page);
    }

    useEffect(()=>{
        getAllBooks(nowPage-1).then(
            kq =>{
                setListBook(kq.result);
                setLoading(false);
                setTotalPages(kq.totalPages);
            }
        ).catch(
            error =>{
                setError(error);
            }
        );
    },[nowPage]) // chi goi 1 lan

    if(loading){
        return(
            <div>
                <h1>The Page is loading ...</h1>
            </div>
        );
    }

    if(error){
        return(
            <div>
                <h1>It has error: ${error}</h1>
            </div>
        );
    }
    return(
        <div className="container">
            <div className="row mt-4 mb-4">
                {
                    listBook.map((book) =>(
                        <BookProps key={book.id} book ={book}/>
                    ))
                }
            </div>
            <Pagination nowPage={nowPage} totalPages={totalPages} pagination={pagination}/>
        </div>
    );
 }
 export default ListBook;
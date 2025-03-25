import React, { useEffect, useState } from "react";
import BookProps from "./components/BookProps";
import Book from "../../models/Book";
import { getAllBooks } from "../../api/BookAPI";
import { error } from "console";

const ListBook : React.FC = () =>{
    const [listBook, setListBook] = useState<Book[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);

    useEffect(()=>{
        getAllBooks().then(
            bookData =>{
                setListBook(bookData)
                setLoading(false);
            }
        ).catch(
            error =>{
                setError(error);
            }
        );
    },[])

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
            <div className="row mt-4">
                {
                    listBook.map((book) =>(
                        <BookProps key={book.id} book ={book}/>
                    ))
                }
            </div>
        </div>
    );
 }
 export default ListBook;
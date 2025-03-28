import React from "react";
import { useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";
import Book from "../../models/Book";
import { findBookById } from "../../api/BookAPI";
import BookImage from "./components/BookImage";
import EvaluateProduct from "./components/EvaluateProduct";

 const DetailBook : React.FC = () =>{
    const {id} = useParams();
    //khai bao
    const[book,setBook] = useState<Book|null>(null);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);
    let book_id: number = 0;
    try {
        book_id = parseInt(id+'');
        if(Number.isNaN(book_id)){
            book_id = 0;
        }
    } catch (error) {
        book_id = 0;
        console.error("Error",error);
    }
    useEffect(()=>{
        findBookById(book_id)
        .then((book)=>{
            setBook(book);
            setLoading(false);
        })
        .catch((error)=>{
            setError(error);

        })
    },[book_id])
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
    if(!book){
        return(
            <div>
                <h1>This Book is not existed</h1>
            </div>
        );
    }
    return(
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="w-80 p-4 bg-white rounded shadow">
                <div className="row">
                    <div className="col-md-6">
                        <BookImage book_id={book_id}/>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="fw-bold text-dark">Tên Sản Phẩm</h2>
                            <button className="btn btn-light border"><i className="fas fa-heart text-danger"></i></button>
                        </div>
                        <h4 className="text-danger fw-bold fs-4">$199.99</h4>
                        <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col-3">#</th>
                                    <th scope="col-9">First</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <th scope="row">1</th>
                                    <td>@mdo</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">2</th>
                                    <td>@fat</td>
                                    </tr>
                                </tbody>
                            </table>
                        <p>Mota san pham</p>
                        <div className="mb-3">
                            <span className="badge bg-warning text-dark">★ ★ ★ ★ ☆</span> (4.5/5)
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center">
                                <i className="fas fa-shopping-cart me-2"></i> Thêm vào giỏ hàng
                            </button>
                            <button className="btn btn-primary w-50 d-flex align-items-center justify-content-center">
                                <i className="fas fa-credit-card me-2"></i> Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
                <EvaluateProduct book_id={book_id}/>
            </div>
        </div>
        {/* <!-- Phần đánh giá khách hàng --> */}

    </div>
    )
 }
 export default DetailBook;
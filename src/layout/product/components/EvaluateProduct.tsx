import React from "react";
import { useEffect,useState } from "react";
import Image from "../../../models/Image";
import { Carousel } from "react-responsive-carousel";
import { getAllEvaluationsOfABook } from "../../../api/EvaluationAPI";
import Evaluation from "../../../models/Evaluation";
import User from "../../../models/User";
import { getUserByEvaluation } from "../../../api/EvaluationAPI";

interface EvaluateProductInterface{
    book_id : number;
}
 const EvaluateProduct : React.FC<EvaluateProductInterface> = (props) =>{
    
    const book_id : number = props.book_id;
    const [listEvaluation, setListEvaluation] = useState<Evaluation[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState(null);
    const [listUser, setListUser] = useState<User[]>([]);


        useEffect(()=>{
            getAllEvaluationsOfABook(book_id).then(
                danhSach =>{
                    setListEvaluation(danhSach)
                    setLoading(false);
                }
            ).catch(
                error =>{
                    setError(error);
                }
            );
        },[])
        console.log(listEvaluation.length);

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
        <div className="mt-3">
        <h4 className="fw-bold mb-3">Đánh Giá Khách Hàng</h4>
        <div className="text-start d-flex flex-column align-items-start">
        {
            listEvaluation.map((danhGia,index) =>(
            <div className="border-bottom pb-3 mb-3">
                <p className="mb-1 fw-bold">Chua lay dc username</p>
                <span className="badge bg-warning text-dark">{danhGia.ratingMark} ★ ★ ★ ★ ★</span>
                <p className="text-muted">{danhGia.comment}</p>
            </div>
            ))
        }
        </div>
    </div>
    );
 }
 export default EvaluateProduct;
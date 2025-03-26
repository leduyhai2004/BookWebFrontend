import React from "react";

interface PaginationInterface{
    nowPage : number;
    totalPages : number;
    pagination : any;
}

export const Pagination : React.FC<PaginationInterface> = (props) =>{ // day la cai dc truyen vao, ma da la interface thi bat buoc phai co day du cac thuoc tinh
    const paginationList =[];
    if(props.nowPage === 1){
        paginationList.push(props.nowPage);
        // muon add them 2 trang dang sau
        if(props.totalPages >= props.nowPage+1){
            // them trang 2
            paginationList.push(props.nowPage+1);
        }
        if(props.totalPages >= props.nowPage+2){
            // them trang 3
            paginationList.push(props.nowPage+2);
        }
    }else if(props.nowPage > 1){
        //2 trang nam o dang truoc trang hien tai
        if(props.nowPage >= 3){
            paginationList.push(props.nowPage-2);
        }
        if(props.nowPage >= 2){
            paginationList.push(props.nowPage-1);
        }
        // thm trang hien tai vao
        paginationList.push(props.nowPage);

        //2 trang nam o dang truoc trang hien tai
        if(props.totalPages >= props.nowPage+1){
            paginationList.push(props.nowPage+1);
        }
        if(props.totalPages >= props.nowPage+2){
            paginationList.push(props.nowPage+2);
        }
    }

    return (
        <nav aria-label="...">
            <ul className="pagination">
                <li className="page-item" onClick={()=>props.pagination(1)}>
                <button className="page-link"  >First Page</button>
                </li>
                    {
                        paginationList.map(page => (
                            <li className="page-item " key={page} onClick={()=>props.pagination(page)}>
                            <button className={"page-link " + (props.nowPage === page?"active" : "")} >{page}</button>
                            </li>
                        ))
                    }
                <li className="page-item" onClick={()=>props.pagination(props.totalPages)}>
                <button className="page-link" >Last Page</button>
                </li>
            </ul>
        </nav>
    );
}
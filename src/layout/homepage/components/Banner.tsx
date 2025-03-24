import React from "react";
function Banner(){
    return(
        <div>
            <div className="p-5 mb-4 bg-dark">
                <div className="container-fluid py-5 text-white d-flex justify-content-center align-items-center">
                    <div>
                        <h5 className="display-5 fw-bold">
                            Hãy tận hưởng việc đọc sách everyday :)))
                        </h5>
                        <p>Lê Duy Hải</p>
                        <button className="btn btn-primary btn-lg text-white float-end">Cùng Khám Phá Nhé</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Banner;
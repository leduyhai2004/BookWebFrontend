import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

const TestLogin = () =>{
    const [username,setUsername] = useState<string|null>(null);
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const userData = jwtDecode(token);
            console.log(userData)
            if(userData){
                setUsername(userData.sub+'');
            }
        }
    },[]); // de cai [] thi co nghia la chi lam 1 lan thoi

    return(
        <div>
            <h1>
                {username && <div>Hello,{username}</div>}
            </h1>
        </div>
    );
}
export default TestLogin;
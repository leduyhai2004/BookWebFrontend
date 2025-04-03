import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    isAdmin : boolean;
    isUser : boolean;
    isStaff : boolean;
}

const RequireAdmin = <P extends object>(WrappedComponent : React.ComponentType<P>) =>{
    const WithAdminCheck: React.FC<P> = (props)=>{
        const navigate = useNavigate();


        useEffect(()=>{
        const token = localStorage.getItem('token');
        console.log(token);
        // trong tinh huong chua dang nhap
            if(!token){
                navigate("/login")
                return ;
            }else{
                //giai ma token
                const decodedToken = jwtDecode(token) as JwtPayload;
                console.log(decodedToken);

                //lay thong tin cu the
                const isAdmin = decodedToken.isAdmin;

                //kiem tra cu the( co the xu ly them neu role nao thi vao trang  nay chang han)
                if(!isAdmin){
                    navigate("/403-error")
                    return ;
                }
            }
        },[navigate])
        
        return <WrappedComponent{...props}/>
    }
    return WithAdminCheck;
}
export default RequireAdmin;
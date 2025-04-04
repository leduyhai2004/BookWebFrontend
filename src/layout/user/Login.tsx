import React, { useState } from "react";
import "../../css/login.css"
import { Link, useNavigate } from "react-router-dom";
import { METHODS } from "http";
const Login = () =>{
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    const handleLogin=()=>{
        const loginReq = {
            username : username,
            password : password,
        };
        fetch("http://localhost:8080/account/login",{
            method : "POST",
            headers :{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(loginReq)
        }).then(
            (response)=>{
                if(response.ok){
                    return response.json(); // cai nay dc truyen vao data o duoi
                }else{
                    throw new Error('Fail to login')
                }
            }
        ).then(
            (data)=>{
                // xu ly dang nhap thanh cong
                const {jwt} = data;
                // lu token
                localStorage.setItem('token',jwt);
                setNotification('Login success')
                //dieu huong den trang nao do, tuy
                navigate("/");

            }
        ).catch((error)=>{
            console.log(error,"Loi dang nhap o registerUser.tsx");
            setError("Fail to login!Try again")
        })
    }
    return(
        <section className="vh-100">
            <div className="container-fluid">
                <div className="row">
                <div className="col-sm-6 text-black">
                    <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

                    <form style={{width: "23rem"}}>

                        <h3 className="fw-normal mb-3 pb-3" style={{letterSpacing: "1px"}}>Log in</h3>

                        <div data-mdb-input-init className="form-outline mb-4">
                        <input type="username" id="username"
                         className="form-control form-control-lg"
                         value={username}
                         onChange={(e) => setUserName(e.target.value)} />
                        <label className="form-label" >Username</label>
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                        <input type="password" id="password" 
                        className="form-control form-control-lg" 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}/>
                        <label className="form-label" >Password</label>
                        </div>

                        <div className="pt-1 mb-4">
                        <button data-mdb-button-init data-mdb-ripple-init 
                        className="btn btn-info btn-lg btn-block" type="button"
                        onClick={handleLogin}
                        >Login</button>
                        </div>
                        {
                            error && <div style={{color:"red"}}>{error}</div>
                        }
                        {
                            notification && <div style={{color:"green"}}>{notification}</div>
                        }


                        <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                        <p>Don't have an account?  </p>
                            <Link to="/register">Register here</Link>
                    </form>

                    </div>

                </div>
                <div className="col-sm-6 px-0 d-none d-sm-block">
                    <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D"
                    alt="Login image" className="w-100 vh-100" style={{objectFit: "cover", objectPosition: "left"}}/>
                </div>
                </div>
            </div>
        </section>
    );
}
export default Login;
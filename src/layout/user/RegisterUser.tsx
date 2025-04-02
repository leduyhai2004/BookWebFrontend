import React, { useState } from "react";
export default function RegisterUser(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [password,setPassword] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('');
    const [gender,setGender] = useState('F');
    const [isActive,setIsActive] = useState('0');
    const [idOfActivation,setIdOfActivation] = useState('');

    //thong bao loi
    const [errorUsername,setErrorUsername] = useState('');
    const [errorEmail,setErrorEmail] = useState('');
    const [errorPassword,setErrorPassword] = useState('');

    // Thông báo thành công hoặc thất bại
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // xu ly thong tin ng dung nhap vao
    const hanleSubmit = async(e : React.FormEvent)=>{
        //clear erorr
        setErrorEmail('');
        setErrorUsername('');
        setErrorPassword('');
        //tranh click chuot lien tuc
        e.preventDefault();
        // kiem tra email...
        const isUsernameValid = !await checkUsernameExisted(username);
        const isEmailValid = !await checkEmailExisted(email);
        const isPasswordValid = !await checkPassword(password);

        if(isEmailValid && isUsernameValid && isPasswordValid){
            try {
                const url = "http://localhost:8080/account/register";
                const response = await fetch(url,{
                    method:'POST',
                    headers: {
                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        username : username,
                        email : email,
                        firstName : firstName,
                        lastName : lastName,
                        password : password,
                        gender : gender,
                        phoneNumber : phoneNumber,
                        isActive : isActive,
                        idOfActivation : idOfActivation,
                    })
                });
                if(response.ok){
                    setSuccessMessage("Register successful, check email!");
                    setErrorMessage('');
                }else{
                    setErrorMessage("Register failed. Please try again.");
                    setSuccessMessage('');
                }

            } catch (error) {
                setErrorMessage("An error occurred. Please try again later.");
                setSuccessMessage('');
            }
        }

    }
    const checkPassword = (password : string) =>{
        //Minimum eight characters, at least one letter, one number and one special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if(!passwordRegex.test(password)){
            setErrorPassword('Password must be minimum eight characters, at least one letter, one number and one special character')
            return true;
        }else{
            setErrorPassword('');
            return false;
        }

    }

    const handlePassword = async (e : React.ChangeEvent<HTMLInputElement>)=>{
        //kiem tra ton tai
        setPassword(e.target.value);
        setErrorPassword("");
        return checkPassword(e.target.value);

    }


    const checkUsernameExisted = async (username : string) =>{
        const url = `http://localhost:8080/users/search/existsByUsername?username=${username}`; // true or false
        //call api
        try {
            const response = await fetch(url);
            const data = await response.text();
            if(data === "true"){
                setErrorUsername("Username is existed");
                return true;
            }
            return false;
        } catch (error) {
            console.log("Error when handle username",error);
            return false;
        }
    }

    const checkEmailExisted = async (email : string) =>{
        const url = `http://localhost:8080/users/search/existsByEmail?email=${email}`; // true or false
        //call api
        try {
            const response = await fetch(url);
            const data = await response.text();
            if(data === "true"){
                setErrorEmail("Email is existed");
                return true;
            }
            return false;
        } catch (error) {
            console.log("Error when handle email",error);
            return false;
        }
    }

    
    const hanleUsername = async (e : React.ChangeEvent<HTMLInputElement>)=>{
        //thay doi gia tri
        setUsername(e.target.value);
        //kiem tra
        setErrorUsername("");

        //kiem tra ton tai
        return checkUsernameExisted(e.target.value);

    }

    const handleEmail = async (e : React.ChangeEvent<HTMLInputElement>)=>{
        //thay doi gia tri
        setEmail(e.target.value);
        //kiem tra
        setErrorEmail("");

        //kiem tra ton tai
        return checkEmailExisted(e.target.value);

    }
    
    return(
        <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
            <div className="col-12 col-lg-9 col-xl-7">
                <div className="card shadow-2-strong card-registration" >
                <div className="card-body p-4 p-md-5">
                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
                    <form onSubmit={hanleSubmit} className="form">

                    <div className="row">
                        <div className="col-md-4 mb-4">

                        <div data-mdb-input-init className="form-outline">
                            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" id="firstName" className="form-control form-control-lg" />
                            <label className="form-label" >First Name</label>
                        </div>

                        </div>
                        <div className="col-md-4 mb-4">

                        <div data-mdb-input-init className="form-outline">
                            <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" id="lastName" className="form-control form-control-lg" />
                            <label  className="form-label" >Last Name</label>
                        </div>

                        </div>
                        <div className="col-md-4 mb-4">

                        <div data-mdb-input-init className="form-outline">
                            <input value={username} onChange={hanleUsername} type="text" id="username" className="form-control form-control-lg" />
                            <label className="form-label" >Username</label>
                        </div>
                        <div style={{color: 'red'}}>{errorUsername}</div>

                        </div>
                    </div>

                    <div className="row">
                        {/* <div className="col-md-6 mb-4 d-flex align-items-center">

                        <div data-mdb-input-init className="form-outline datepicker w-100">
                            <input type="text" className="form-control form-control-lg" id="birthdayDate" />
                            <label  className="form-label">Birthday</label>
                        </div>

                        </div> */}
                        <div>

                        <h6 className="mb-2 pb-1">Gender: </h6>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="femaleGender"
                            value='F' onChange={(e) => setGender(e.target.value)} checked={gender === 'F'}  />
                            <label className="form-check-label">Female</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="maleGender"
                            value="M" onChange={(e) => setGender(e.target.value)} checked={gender === 'M'} />
                            <label className="form-check-label" >Male</label>
                        </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-4 pb-2">

                        <div data-mdb-input-init className="form-outline">
                            <input  value={email} onChange={handleEmail} type="email" id="emailAddress" className="form-control form-control-lg" />
                            <label className="form-label" >Email</label>
                        </div>
                        <div style={{color: 'red'}}>{errorEmail}</div>

                        </div>
                        <div className="col-md-6 mb-4 pb-2">

                        <div data-mdb-input-init className="form-outline">
                            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="tel" id="phoneNumber" className="form-control form-control-lg" />
                            <label className="form-label" >Phone Number</label>
                        </div>

                        </div>
                    </div>

                    

                    <div className="row">
                        <div className="col-12">
                        <div data-mdb-input-init className="form-outline">
                            <input  value={password} onChange={handlePassword} type="password" className="form-control form-control-lg" />
                            <label className="form-label" >Password</label>
                        </div>
                        <div style={{color: 'red'}}>{errorPassword}</div>
                        </div>
                    </div>

                    <div className="mt-4 pt-2">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                     {/* Hiển thị thông báo đăng ký thành công hoặc thất bại */}
                     {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
                     {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
                </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    )
}
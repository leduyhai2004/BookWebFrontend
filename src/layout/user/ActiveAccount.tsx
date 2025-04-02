import React, { useEffect, useState } from "react";


export default function ActiveAccount(){
    const [email,setEmail] = useState('');
    const [idOfActivation,setIdOfActivation] = useState('');
    const [isActive, setIsActive]  = useState(false);
    const [notification, setNotification]  = useState('');


    useEffect(()=>{
        const searchParams = new URLSearchParams(window.location.search);
        const emailParam = searchParams.get("email");
        const idOfActivationParam = searchParams.get("idOfActivation");
        if(emailParam && idOfActivationParam){
            setEmail(emailParam);
            setIdOfActivation(idOfActivationParam);
            // handleActive();
        }
    },[]);// lam 1 lan

    // Add a second useEffect that triggers handleActive when email and idOfActivation change
    useEffect(() => {
        if (email && idOfActivation) {
            handleActive();
        }
    }, [email, idOfActivation]); // Run when these dependencies change

    const handleActive = async() =>{
        try {
            console.log("check call ai active")
            const url : string = `http://localhost:8080/account/active?email=${email}&idOfActivation=${idOfActivation}`
            const response = await fetch(url,
                {method:'GET'}
            );
            console.log(url);
            if(response.ok){
                setIsActive(true);
                console.log("fetch ai active ok")
            }else{
                const errorText = await response.text();
                setNotification(errorText);
                console.log('error when response is not ok');
            }
        } catch (error) {
            console.log("Error when active",error);
        }
    }

    return(
        <div>
            <h1>
                Active account
                </h1>
                {isActive
                 ?(<p>Active account successful, please login to continue</p>)
                 :(<p>{notification}</p>)
                }
        </div>
    );
}
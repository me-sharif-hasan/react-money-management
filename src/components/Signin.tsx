import {signInWithPopup} from "firebase/auth"
import {auth, authConfig, provider} from "../firebase/config"
import React, {useEffect, useState} from "react";
import {
    Alert, Fab, Skeleton,
} from "@mui/material";
import { User as FirebaseUser } from "firebase/auth";
import GoogleButton from "react-google-button";
import {HashRouter, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./home";
import ShowSectors from "./sectors/ShowSectors.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const Signin = () => {
    const [user,setUser]=useState<FirebaseUser|null>(null);
    const [showLoginButton,setShowLoginButton]=useState(false);
    const [error,setError]=useState(null);
    function handleSigning() {
        signInWithPopup(auth,provider).then((user)=>{
            authConfig.sectorRoot=`sectors/${user.user.uid}`
            setShowLoginButton(false);
        }).catch(error=>{
            setError(error);
        });
    }

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user==null){
                setShowLoginButton(true);
            }else{
                authConfig.sectorRoot=`sectors/${user.uid}`
                setUser(user);
                setShowLoginButton(false);
            }
        });
    },[])
    return (
        <>
            <div>
                {showLoginButton&&
                    <div className={'flex w-screen h-screen justify-center items-center flex-col'}>
                        {showLoginButton&&<GoogleButton onClick={handleSigning}>গুগল দ্বারা লগিন করুন</GoogleButton>}
                        {error&&<Alert className={'mt-3'} severity={'error'}>লগিন ব্যর্থ হয়েছে। আবার চেস্টা করুন</Alert>}
                    </div>
                }
                {!showLoginButton&&authConfig.sectorRoot!=""&&
                    <HashRouter>
                        <Routes>
                            <Route path={''} index element={<Home/>}/>
                            <Route path={'sector-details/:sector_key'} index element={<ShowSectors/>}/>
                        </Routes>
                    </HashRouter>
                }

            </div>
        </>
    )
}

export default Signin;
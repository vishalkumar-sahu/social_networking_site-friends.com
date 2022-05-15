import React, {useState, useContext} from 'react';
import appstore from "../../img/login_img/appstore.png";
// import playstore from "../../img/login_img/playstore.png";
import gifg from "../../img/home/A.gif";

import '../../styles/login.css'

import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css'

import {UserContext} from '../../App'

const Login = () => {
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    
    const CheckData = () =>{
        fetch("/signin",{
            method : "post",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                phone,
                password
            })

        })
        .then(res => res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER", payload: data.user})
                M.toast({html: "Successfully signedin !!!", classes:"#43a047 green darken-1"})
                navigate('/home')
            }
        }).catch(err=>{
            console.log(err)
        })
    
    }

    const forget = () =>{
        navigate('/forgettenPassword')
    }

    return (
        <>
        <div className='login'>
            <div className="body_login">
                <header></header>
                <main className="main_login">
                    <div className="left">
                        <h1>Welcome 😃</h1>
                        <br></br>
                        <h5>Connecting you with digital life..</h5>
                        <img src="https://i.pinimg.com/originals/e3/b9/8a/e3b98a6c46e5e264dc38b93d198f4e5f.gif" alt="error"/>

                    </div>
                    <div className="middle_login">
                        <div className="signin_in">    
                            <h1 className="title">Friends.com</h1>
                            {/* <form method='post'> */}
                                <div>
                                    <input
                                        className="input_ele"
                                        type="text"
                                        maxLength="10"
                                        minLength="10"
                                        name="phone"
                                        placeholder="Phone no."
                                        value={phone} 
                                        onChange={(e)=>setPhone(e.target.value)}
                                    />
                                    <br />
                                    <input
                                        className="input_ele"
                                        type="password"
                                        name="password"
                                        id=""
                                        placeholder="Password"
                                        value={password} 
                                        onChange={(e)=>setPassword(e.target.value)}
                                    />
                                    <br />
                                    <input className="input_ele" type="submit" value="Login" onClick={()=>CheckData()} />
                                </div>
                            {/* </form> */}
                            {/* <pre> Or SIGN IN using</pre> */}

                            {/* <!-- <img class="input_ele" id="google" src="login/img/icons8-google-48.png" alt="Login with Google" style="cursor: pointer;"><br> --> */}
                            {/* <div className="g-signin2 google" data-onsuccess="onSignIn"></div> */}
                            {
                                <div className="input_ele" onClick={()=>forget()} > <a>Forgotten your password ?</a> </div>
                            }
                            
                            <div className="forgotten_pass"></div>
                        </div>
                        <div className="register">
                            <span>Don't have an account ?  </span>
                            {/* <a role="button" href="/signup" id="signup">
                                Sign up
                            </a> */}
                            <Link to="/signup">Sign up</Link>
                        </div>
                        {/* <div className="download">
                            <div className="topic">Get the app.</div>
                            <img
                                src={appstore}
                                alt="Download from Playstore"
                                className="playstore"
                            />
                            <img
                                src={playstore}
                                alt="Download from Appstore"
                                className="appstore"
                            />
                        </div> */}
                    </div>
                    <div className="right"></div>
                </main>
                <footer></footer>
            </div>
            </div>
        </>
    );
};

export default Login;

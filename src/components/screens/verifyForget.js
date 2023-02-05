import React, {useState} from 'react'

import '../../styles/signup.css'

import { useNavigate, Link } from 'react-router-dom';
import M from 'materialize-css'

const   ForgetPasswordOtp = () => {
    const navigate = useNavigate()
    const [otp, setOtp] = useState("")
    

    const verifyOTP = () =>{
        fetch("https://friends-com-backend.onrender.com/verifyForgetPasswordOtp",{
            method : "post",
            headers : {
                "Content-Type" : "application/json",
            },
            body:JSON.stringify({
                otp,
                phone : localStorage.getItem("phone")
                
            })

        })
        .then(res => res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
                localStorage.removeItem("phone")
                navigate('/signup')
            }
            else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                navigate('/changePassword')
            }
        }).catch(err=>{
            console.log(err)
        })
        
    }


    return (
        <>
            <div className='body'>
                <header></header>
                <main className="main_signup">
                <div className="left">
                        <h1>Welcome 😃</h1>
                        <br></br>
                        <h5>Connecting you with digital life..</h5>
                        <br></br>
                        <br></br>
                        
{/* <h5>You are just One Step away .Signup fast!
                        </h5> */}
                        <img src="https://i.pinimg.com/originals/e3/b9/8a/e3b98a6c46e5e264dc38b93d198f4e5f.gif" alt="error"/>

                    </div>
                    <div className="middle_up">
                        <div className="signup">
                            <h1 className='title'>Friends.com</h1>
                            {/* <form> */}
                                <div>
                                    <input className="input_ele" type="number" maxLength={6} minLength={6} name="otp" placeholder="Enter otp" value={otp} onChange={(e)=>setOtp(e.target.value)} /><br />
                                    
                                    <input className="input_ele" type="submit" value="Submit Otp" onClick={()=>verifyOTP()} />
                                </div>
                            {/* </form> */}

                            {/* <pre> Or  SIGN UP using</pre> */}

                            {/* <!-- <img className="input_ele" id="google" src="login/img/icons8-google-48.png" alt="Login with Google" style="cursor: pointer;"><br> --> */}
                            {/* <a href="/auth/google"><div className="g-signin2 google" data-onsuccess="onSignIn"></div></a> */}

                            {/* <div className="forgotten_pass">By signing up, you agree to our Terms, Data Policy and Cookie Policy.</div> */}
                        </div>
                        <div className="signin register">
                            <span>Have an account ?</span>
                            <span>
                                <Link to="/">Login</Link>
                            </span>
                            {/* <a role="button" href="/">Login</a> */}
                        </div>
                        {/* <div className="download">
                            <div className="topic">Get the app.</div>
                            <img src={playstore} alt="Download from Playstore" className="playstore" />
                            <img src={appstore} alt="Download from Appstore" className="appstore" />
                        </div> */}
                    </div>
                    <div className="right"></div>
                </main>
                <footer>

                </footer>
            </div>
        </>
    )
}

export default ForgetPasswordOtp
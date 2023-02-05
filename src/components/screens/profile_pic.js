import React from "react";
import '../../styles/profile_pic.css'
import { UserContext } from "../../App";

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css'

import logo from '../../img/home/logo.PNG'
import home from '../../img/home/home.PNG'
import messenger from '../../img/home/messenger.PNG'
import add from '../../img/home/add.PNG'
import like from '../../img/home/like.PNG'
import logout from '../../img/home/outline_logout_black_24dp.png'

const Profile_pic = () => {
    const navigate = useNavigate()
    const {state, dispatch} = useContext(UserContext)
    
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (image) {
          setImageUrl(URL.createObjectURL(image));
        }
    }, [image]);

    useEffect(() => {
        if(url){
            fetch("https://friends-com-backend.onrender.com/profilePic",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    url,
                })
    
            })
            .then(res => res.json())
            .then(async data=>{
                if(data.error){
                    return M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else{
                    await dispatch({type:"UPDATEPIC", payload:{pic:data.pic}});
                    localStorage.setItem("user", JSON.stringify({...state, pic:data.pic}))
                    M.toast({html: "Profile picture uploded successfully !!!", classes:"#43a047 green darken-1"})
                    navigate('/profile')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }, [url]);


    const uploadPic = () =>{
        const data = new FormData()
        data.append('file', image)
        data.append("upload_preset", "friends_com")
        data.append("cloud_name", "vishalkumar-sahu")
        fetch("http://api.cloudinary.com/v1_1/vishalkumar-sahu/image/upload", {
            method:"post",
            body:data
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data)
            setUrl(data.url);
        })
        .catch(err=>{
            console.log(err)
        });
    }

    const logoutUser = ()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        M.toast({html: "Successfully logout !!", classes:"#43a047 green darken-1"})
        navigate('/')
    }
    

    return(
        <>
            <nav className="navbar">
                <div className="nav-wrapper">
                    <img src={logo} className="brand-img" alt="" onClick={()=> navigate('/home')} />
                    {/* <input type="text" className="search-box" placeholder="search" /> */}
                    <div className="nav-items">
                        <img src={home} className="icon" alt="" onClick={()=> navigate('/home')} />
                        {/* <img src={messenger} className="icon" alt="" /> */}
                        <img src={add} className="icon" alt="" onClick={()=> navigate('/createpost')} />
                        {/* <img src={explore} className="icon" alt="" /> */}
                        {/* <img src={like} className="icon" alt="" /> */}
                        <img className="icon user-profile" src={state ? state.pic : "loading..."} onClick={()=> navigate('/profile')} />
                        <img src={logout} className="icon" id='logout' alt="" onClick={()=>logoutUser()} />
                    </div>
                    
                </div>
            </nav>
            <div className="create-post">
            <div className="create-post__content">
                <div className="create-post__container">
                <div className="create-post__title">Upload Profile pic</div>
                {/* <div className="create-post__close">
                    <img alt="close"  />
                </div> */}
                </div>
                <div className="create-post__subtitle"></div>
                {
                    <div>
                        <div className="create-post__form">
                            <input
                                style={{ paddingLeft:'5px' }}
                                // ref={filepickerRef}
                                type="file"
                                accept="image/*"
                                // hidden
                                onChange={e => setImage(e.target.files[0])}
                                
                            />
                            {image && <div className="create-post__image" > 
                                {/* <div> */}
                                    <img src={imageUrl} alt="post-content" />
                                {/* </div> */}
                                </div>
                            }

                            {!image && <div  className="create-post__image-picker">
                                <svg aria-label="Icon to represent media such as images or videos" className="_8-yf5 " color="#262626" fill="#262626" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
                                <p>Upload photo here</p>
                            </div>
                            }

                            
                        </div>
                        <div className="create-post__footer">
                        <div className="create-post__upload" >
                            <span onClick={()=> uploadPic()}>Upload</span>
                        </div>
                        </div>
                    </div>
                }
            </div>
            </div>
        </>
    )


}

export default Profile_pic

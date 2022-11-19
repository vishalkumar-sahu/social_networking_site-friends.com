import React from "react";
import '../../styles/createPost.css'
import { UserContext } from "../../App";

import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css'

import cover_1 from '../../img/home/cover 1.png'
import logo from '../../img/home/logo.PNG'
import home from '../../img/home/home.PNG'
import messenger from '../../img/home/messenger.PNG'
import add from '../../img/home/add.PNG'
import like from '../../img/home/like.PNG'
import logout from '../../img/home/outline_logout_black_24dp.png'

const Create_post = ()=>{
        const navigate = useNavigate()
        const {state, dispatch} = useContext(UserContext)
        const [selectedImage, setSelectedImage] = useState(null);
        const [imageUrl, setImageUrl] = useState(null);

        const [caption, setCaption] = useState("")

        const [url, setUrl] = useState("")
      
        useEffect(() => {
          if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
          }
        }, [selectedImage]);

        useEffect(() => {
            if(url){
                fetch("/createpost",{
                    method : "post",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        caption,
                        url,
                    })
        
                })
                .then(res => res.json())
                .then(data=>{
                    if(data.error){
                        return M.toast({html: data.error, classes:"#c62828 red darken-3"})
                    }
                    else{
                        M.toast({html: "Created post successfully !!!", classes:"#43a047 green darken-1"})
                        navigate('/home')
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }, [url]);

        const logoutUser = ()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            M.toast({html: "Successfully logout !!", classes:"#43a047 green darken-1"})
            navigate('/')
        }
    

        const postDetails = ()=>{
            const data = new FormData()
            data.append('file', selectedImage)
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
                <div className="body_post">
                <header>
                    <div></div>
                </header>
                <main className="main_createPost">
                    <div className="left"></div>
                    <div className="middle">
                        <div className="create_post">
                            <h3>Create new Post</h3>

                            {/* <form action="" method="post"> */}
                                <div className="post_class" >
                                    <div className="upload_photo">

                                        <input type="file" id="post_photo" name="url" accept="image/*" onChange={e => setSelectedImage(e.target.files[0])} />
                                        {imageUrl && selectedImage && (
                                            // <Box mt={2} textAlign="center">
                                            <>
                                            <div className="Div_output"><img src={imageUrl} alt={selectedImage.name} id="output" /></div>
                                            
                                            {/* // </Box> */}
                                            </>
                                        )}
                                        
                                    </div>
                                    <div className="add_caption">
                                        <div className="user">
                                            <div className="profile_pic"><img src={state ? state.pic : "loading..."} alt="" /></div>
                                            <p className="create_username">{state ? state.username : "loading..."}</p>
                                        </div>
                                        <div className="caption">
                                            <textarea name="caption" placeholder="Caption here ..." id="textarea_caption" cols="35" rows="15" value={caption} onChange={(e)=>setCaption(e.target.value)} />
                                        </div>
                                    </div>

                                    
                                </div>
                                <input type="submit" value="Post" className="post_btn" onClick={()=>postDetails()} />
                                {/* <button className="post_btn" onClick={()=>postDetails()}>Post</button> */}
                            {/* </form> */}

                        </div>
                    </div>
                    <div className="right"></div>
                   
                    
                </main>
                
                
              
                </div>
                <footer className="foot">
                        
                        </footer>
    
            </>
        )
}


export default Create_post
import React, {useEffect, useState, useContext} from "react";
import '../../styles/profile.css'
import { UserContext } from "../../App";

import logo from '../../img/home/logo.PNG'
import home from '../../img/home/home.PNG'
import messenger from '../../img/home/messenger.PNG'
import add from '../../img/home/add.PNG'
import like from '../../img/home/like.PNG'
import logout from '../../img/home/outline_logout_black_24dp.png'

import { useNavigate } from 'react-router-dom'

import M from 'materialize-css'

const Profile = ()=>{

    const navigate = useNavigate()

    const [mypics, setpics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [bio, setBio] = useState([])
    // const [bio_entered, setBio_entered] = useState(null)

    console.log(state)
    useEffect(()=>{

        fetch("/mypost",{
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },

        })
        .then(res => res.json())
        .then(result =>{
            setpics(result.mypost)
            console.log(result)
        })

    }, []);

    useEffect(()=>{
        fetch('/bio', {
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=> res.json())
        .then(result =>{
            console.log(result)
            setBio(result.user_bio)
            console.log(bio)
        })

    }, []);

    // useEffect(()=>{
        
    // }, [bio_entered]);

    const logoutUser = ()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        M.toast({html: "Successfully logout !!", classes:"#43a047 green darken-1"})
        navigate('/')
    }
    
    const uploadPicRoute = ()=>{
        navigate('/profile/profilePic')
    }

    const addBio = ()=>{
        const addBio = window.prompt("Enter bio here : ");
        console.log(addBio)
        // setBio_entered(window.prompt("Enter bio here : "));
        // console.log(bio_entered)

        if(addBio != null){
            fetch("/bioset",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    bio : addBio,
                })

            })
            .then(res => res.json())
            .then(data=>{
                if(data.error){
                    return M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else{
                    dispatch({type:"UPDATEBIO", payload:{bio : data.bio}});
                    localStorage.setItem("user", JSON.stringify({...state, bio:data.bio}))
                    M.toast({html: "Bio updated successfully !!!", classes:"#43a047 green darken-1"})
                    window.location.reload()
                    navigate('/profile')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
        
    }


    return (
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
            <div className="root">
            <header>

            <div className="container">

                <div className="profile">

                    {
                        <div className="profile-image">

                            <img src={state ? state.pic : "loading..."} id="profile_pic" alt="" onClick={()=> uploadPicRoute()} />

                        </div>
                    }

                    <div className="profile-user-settings">

                        <h1 className="profile-user-name">{state ? state.username : "loading..."}</h1>

                        
                        
                        
                        <button className="btn profile-settings-btn" aria-label="profile settings"><i className="fas fa-cog" aria-hidden="true"></i></button>
                    
                    </div>

                    <div className="profile-stats">

                        <ul>
                            <li><span className="profile-stat-count">{mypics.length}</span> posts</li>
                            <li><span className="profile-stat-count">{state ? state.followers.length : 0}</span> followers</li>
                            <li><span className="profile-stat-count">{state ? state.following.length : 0}</span> following</li>
                        </ul>

                    </div>

                    <div className="profile-bio">
                        <span className="profile-real-name">{state ? state.name : "loading..."}</span><br />
                        <span className="bio_set">
                            {
                                bio.map((item)=>{
                                    return(
                                        <>
                                            {
                                                item.bio == ""
                                                ?
                                                <button style={{"fontSize":"16px", "padding":"5px"}} onClick={()=>addBio()}>Add Bio</button>
                                                :
                                                <p> <p>{item.bio}</p> <button style={{"fontSize":"16px", "padding":"5px"}} onClick={()=>addBio()}>Update Bio</button></p>
                                                
                                            }
                                        </>
                                    )
                                })
                                // // state.bio != null
                                // // ?
                                // <button style={{"fontSize":"16px", "padding":"5px"}} onClick={()=>addBio()}>Add Bio</button>
                                // // :
                                // // <p>{state.bio}</p>
                            }
                             
                        </span>


                    </div>

                </div>
                {/* <!-- End of profile section --> */}

            </div>
            {/* <!-- End of container --> */}

            </header>
{/* 
            <div className="beech"> 
                Posts
                <br></br>
                
            </div> */}

            <main>

            <div className="container">

                <div className="gallery">

                    {
                        mypics.map(item =>{
                            return(
                                
                                <div className="gallery-item " tabIndex="0">
                                   <div className="gool">
                                    <img key={item._id} src={item.photo} className="gallery-image" alt={item.caption} />
                                       </div>
                                    <div className="gallery-item-info">

                                        <ul>
                                            <li key={item._id} className="gallery-item-likes"><span className="visually-hidden">Likes:</span><i className="fas fa-heart" aria-hidden="true"></i> {item.likes.length}</li>
                                            <li  key={item._id} className="gallery-item-comments"><span className="visually-hidden">Comments:</span><i className="fas fa-comment" aria-hidden="true"></i> {item.comments.length}</li>
                                            <br></br>
                                            <li key={item._id} className="gallery-item-cap"><span className="visually-hidden">caption:</span><i className="fas fa-Cap" aria-hidden="true"></i> {item.caption}</li>   
                                        </ul>

                                    </div>

                                </div>
                            )
                        })
                    }


                </div>
                {/* <!-- End of gallery --> */}

                {/* <!-- <div className="loader"></div> --> */}

            </div>
            {/* <!-- End of container --> */}

            </main>
            </div>
        
        </>
    );

};

export default Profile;
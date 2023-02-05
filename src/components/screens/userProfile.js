import React, {useEffect, useState, useContext} from "react";
import '../../styles/profile.css'
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

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

    const [userProfile, setProfile] = useState(null)
    
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()

    const [showFollow, setshowFollow] = useState(state ? !state.following.includes(userid) : true)

    useEffect(()=>{

        fetch(`https://friends-com-backend.onrender.com/user/${userid}`,{
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },

        })
        .then(res => res.json())
        .then(result =>{
            console.log(result)
            setProfile(result)
        })

    }, []);

    const logoutUser = ()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        M.toast({html: "Successfully logout !!", classes:"#43a047 green darken-1"})
        navigate('/')
    }


    const followUser = ()=>{
        fetch('https://friends-com-backend.onrender.com/follow', {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId : userid
            })
        })
        .then(res => res.json())
        .then(data =>{
            // console.log(data)
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))

            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers : [...prevState.user.followers, data._id]
                    }
                }
            })

            setshowFollow(false)


        })
    }

    const unfollowUser = ()=>{
        fetch('https://friends-com-backend.onrender.com/unfollow', {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId : userid
            })
        })
        .then(res => res.json())
        .then(data =>{
            // console.log(data)
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))

            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item => item != data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers : newFollower
                    }
                }
            })

            setshowFollow(true)
        })
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
        {userProfile ? 
            <div className="root">
            <header>

            <div className="container">

                <div className="profile">

                    <div className="profile-image">

                        <img src={userProfile.user.pic} id="profile_pic" alt="" />

                    </div>

                    <div className="profile-user-settings">

                        <h1 className="profile-user-name">{userProfile.user.username}</h1>

                        {/* <button className="btn profile-edit-btn">Edit Profile</button> */}
                        {
                            showFollow ? 
                            <button className="btn profile-edit-btn" onClick={()=>followUser()}>follow</button>
                            :
                            <button className="btn profile-edit-btn" onClick={()=>unfollowUser()}>unfollow</button>
                        }

                        
                        <button className="btn profile-settings-btn" aria-label="profile settings"><i className="fas fa-cog" aria-hidden="true"></i></button>
                    
                    </div>

                    <div className="profile-stats">

                        <ul>
                            <li><span className="profile-stat-count">{userProfile.posts.length}</span> posts</li>
                            <li><span className="profile-stat-count">{userProfile.user.followers.length}</span> followers</li>
                            <li><span className="profile-stat-count">{userProfile.user.following.length}</span> following</li>
                        </ul>

                    </div>

                    <div className="profile-bio">

                        <p><span className="profile-real-name">{userProfile.user.name}</span> <br />
                            {userProfile.user.bio}
                        </p>



                    </div>

                </div>
                {/* <!-- End of profile section --> */}

            </div>
            {/* <!-- End of container --> */}

            </header>

            <main>

            <div className="container">

                <div className="gallery">

                    {
                        userProfile.posts.map(item =>{
                            return(
                                <div className="gallery-item" tabIndex="0">
                                   <div className="gool">
                                    <img key={item._id} src={item.photo} className="gallery-image" alt={item.caption} />
                                   </div>
                                    <div className="gallery-item-info">

                                        <ul>
                                            <li key={item._id} className="gallery-item-likes"><span className="visually-hidden">Likes:</span><i className="fas fa-heart" aria-hidden="true"></i> {item.likes.length}</li>
                                            <li  key={item._id} className="gallery-item-comments"><span className="visually-hidden">Comments:</span><i className="fas fa-comment" aria-hidden="true"></i> {item.comments.length}</li>
                                            <br></br>
                                            <li  key={item._id} className="gallery-item-cap"><span className="visually-hidden">caption:</span><i className="fas fa-cap" aria-hidden="true"></i> {item.caption}</li>
                                        
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
        
        : <h2>loading......</h2>}
        </>
    );

};

export default Profile;
import React,{useState, useEffect, useContext} from 'react'
import '../../styles/home.css'

import logo from '../../img/home/logo.PNG'
import home from '../../img/home/home.PNG'
import messenger from '../../img/home/messenger.PNG'
import add from '../../img/home/add.PNG'
import like from '../../img/home/like.PNG'
import cover_1 from '../../img/home/cover 1.png'
import cover_2 from '../../img/home/cover 2.png'
import cover_3 from '../../img/home/cover 3.png'
import cover_4 from '../../img/home/cover 4.png'
import cover_5 from '../../img/home/cover 5.png'
import cover_6 from '../../img/home/cover 6.png'
import cover_7 from '../../img/home/cover 7.png'
import cover_8 from '../../img/home/cover 8.png'
import comment from '../../img/home/comment.PNG'
import send from '../../img/home/send.PNG'
import save from '../../img/home/save.PNG'
import smile from '../../img/home/smile.PNG'

import logout from '../../img/home/outline_logout_black_24dp.png'
import liked from '../../img/home/heart.png'
import love from '../../img/home/love.png'

import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'

import { Link } from 'react-router-dom'



const Home = ()=>{
    const [data, setData] = useState([])
    const [data_following, setData_following] = useState([])
    const {state, dispatch} = useContext(UserContext)
    // console.log(state)
    const navigate = useNavigate()

    useEffect(()=>{
        fetch('/followingPost', {
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=> res.json())
        .then(result =>{
            console.log(result)
            setData_following(result.posts)
        })

    }, []);

    useEffect(()=>{
        
        fetch('/allpost', {
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=> res.json())
        .then(result =>{
            console.log(result)
            setData(result.posts)
        })
    }, []);

    const logoutUser = ()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        M.toast({html: "Successfully logout !!", classes:"#43a047 green darken-1"})
        navigate('/')
    }

    const likePost = (id)=>{
        fetch('/like', {
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postID:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item =>{
                // console.log(item)
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            const newData_following = data_following.map(item =>{
                // console.log(item)
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData_following(newData_following)
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id)=>{
        fetch('/unlike', {
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postID:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item =>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            const newData_following = data_following.map(item =>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData_following(newData_following)
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    
    const makeComment = (text, postID)=>{
        fetch('/comment', {
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postID,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item =>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            const newData_following = data_following.map(item =>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData_following(newData_following)
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const deletePost = (postid)=>{

        if(window.confirm("Are you sure to delete this post ??")){
            fetch(`/deletepost/${postid}`, {
                method : "delete",
                headers:{
                    Authorization:"Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => res.json())
            .then(result =>{
                console.log(result)
                const newData = data.filter(item =>{
                    return item._id !== result._id
                })
                setData(newData)
            })
        }
       
    }

    const Logout_account = () =>{
        if(window.confirm("Are you really want to logout?")){
            logoutUser()
        }
        
    }

    const toprofile = () =>{
        navigate('/profile')
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

            <section className="main">
                <div className="wrapper">
                    <div className="left-col">
               { /*    <div className="status-wrapper">
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_1} alt="" /></div>
                                <p className="username">user_name_1</p>
                            </div>
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_2} alt="" /></div>
                                <p className="username">user_name_2</p>
                            </div>
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_3} alt="" /></div>
                                <p className="username">user_name_3</p>
                            </div>
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_4} alt="" /></div>
                                <p className="username">user_name_4</p>
                            </div>
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_5} alt="" /></div>
                                <p className="username">user_name_5</p>
                            </div>
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_6} alt="" /></div>
                                <p className="username">user_name_6</p>
                            </div>
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_7} alt="" /></div>
                                <p className="username">user_name_7</p>
                            </div>
                            <div className="status-card">
                                <div className="profile-pic"><img src={cover_8} alt="" /></div>
                                <p className="username">user_name_8</p>
                            </div>

                        </div> */}

                        
                        {
                            data_following.map(item =>{
                                // console.log(item)
                                return(
                                    <div className="post" key={item._id}>
                                        <div className="info">
                                            <div className="user">
                                                <div className="profile-pic"><img src={item.postedBy.pic} alt="" /></div>
                                                <h2><p className="username"><Link to={item.postedBy._id != state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.username}</Link></p></h2>
                                            </div>
                                            {
                                                item.postedBy._id == state._id && <span class="material-icons" style={{cursor:"pointer"}} onClick={()=>deletePost(item._id)}>delete</span>
                                            }
                                            
                                            {/* <img src={option} className="options" alt="" /> */}
                                        </div>
                                        <img src={item.photo} className="post-image" alt="" />
                                        <div className="post-content">
                                            <div className="reaction-wrapper">
                                                {item.likes.includes(state._id)
                                                ?
                                                    <img src={liked} className="icon enlarge" alt="" onClick={()=>{unlikePost(item._id)}}/>
        
                                                :
                                                    <img src={love} className="icon enlarge" alt="" onClick={()=>{likePost(item._id)}} />
                                                }
                                                {/* <img src={like_1} className="icon" alt="" /> */}
                                                
                                                {/* <i class="material-icons icon ">favorite</i> */}
                                                
                                                {/* <img src={comment} className="icon" alt="" /> */}
                                                {/* <img src={send} className="icon" alt="" /> */}
                                                {/* <img src={save} className="save icon" alt="" /> */}
                                            </div>
                                            <p className="likes">{item.likes.length} likes</p>
                                            <p className="description"><span>{item.postedBy.name} </span> {item.caption}</p>
                                            {/* <p className="post-time">2 minutes ago</p> */}
                                        </div>
                                        <div>
                                            {
                                                item.comments.map(record=>{
                                                    return(
                                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.username}</span> {record.text}</h6>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="comment-wrapper">
                                            
                                            {/* <img src={smile} className="icon" alt="" /> */}

                                            <form onSubmit={(e)=>{
                                                e.preventDefault()
                                                makeComment(e.target[0].value, item._id)
                                            }}>
                                                <input type="text" className="comment-box" placeholder="Add a comment" />
                                                <span><input type="submit" value="Comment" /></span>
                                            </form>

                                            {/* <input type="text" className="comment-box" placeholder="Add a comment" /> */}
                                            {/* <button className="comment-btn">post</button> */}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {
                            data.map(item =>{
                                // console.log(item)
                                return(
                                    <div className="post" key={item._id}>
                                        <div className="info">
                                            <div className="user">
                                                <div className="profile-pic"><img src={item.postedBy.pic} alt="" /></div>
                                                <h2><p className="username"><Link to={item.postedBy._id != state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.username}</Link></p></h2>
                                            </div>
                                            {
                                                item.postedBy._id == state._id && <span class="material-icons" style={{cursor:"pointer"}} onClick={()=>deletePost(item._id)}>delete</span>
                                            }
                                            
                                            {/* <img src={option} className="options" alt="" /> */}
                                        </div>
                                        <img src={item.photo} className="post-image" alt="" />
                                        <div className="post-content">
                                            <div className="reaction-wrapper">
                                                {item.likes.includes(state._id)
                                                ?
                                                    <img src={liked} className="icon enlarge" alt="" onClick={()=>{unlikePost(item._id)}}  />
        
                                                :
                                                    <img src={love} className="icon enlarge" alt="" onClick={()=>{likePost(item._id)}} />
                                                }
                                                {/* <img src={like_1} className="icon" alt="" /> */}
                                                
                                                {/* <i class="material-icons icon ">favorite</i> */}
                                                
                                                {/* <img src={comment} className="icon" alt="" /> */}
                                                {/* <img src={send} className="icon" alt="" /> */}
                                                {/* <img src={save} className="save icon" alt="" /> */}
                                            </div>
                                            <p className="likes">{item.likes.length} likes</p>
                                            <p className="description"><span>{item.postedBy.name} </span> {item.caption}</p>
                                            <p className="post-time">2 minutes ago</p>
                                        </div>
                                        <div>
                                            {
                                                item.comments.map(record=>{
                                                    return(
                                                        <h6 className="comment-record-space" key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.username}</span> <span className='spaceforcom'> {record.text}</span></h6>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="comment-wrapper">
                                            
                                            {/* <img src={smile} className="icon" alt="" /> */}

                                            <form onSubmit={(e)=>{
                                                e.preventDefault()
                                                makeComment(e.target[0].value, item._id)
                                            }}>
                                                <span><input type="text" className="comment-box" placeholder="Add a comment"  /></span>
                                                <span><input type="submit" value="Comment" /></span>
                                             
                                            </form>
                                            
                                            {/* <input type="text" className="comment-box" placeholder="Add a comment" /> */}
                                            {/* <button className="comment-btn">post</button> */}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    
                    </div>
                    <div className="right-col">
                        {
                            <div className="profile-card">
                                <div className="profile-pic">
                                    <img src={state ? state.pic : "loading..."} alt="" />
                                </div>
                                <div>
                                    <p className="username" onClick={()=> toprofile()}>{state ? state.username : "loading..."}</p>
                                    <p className="sub-text">{state ? state.name : "loading..."}</p>
                                </div>
                                <button className="action-btn" onClick={()=>Logout_account()}>Logout</button>
                            </div>
                        }
                          {/*  <p className="suggestion-text">Suggestions for you</p>
                    <div className="profile-card">
                            <div className="profile-pic">
                                <img src={cover_8} alt="" />
                            </div>
                            <div>
                                <p className="username">Vishal Kumar Sahu</p>
                                <p className="sub-text">followed by user</p>
                            </div>
                            <button className="action-btn">follow</button>
                        </div>
                        <div className="profile-card">
                            <div className="profile-pic">
                                <img src={cover_7} alt="" />
                            </div>
                            <div>
                                <p className="username">Vishal Kumar Sahu</p>
                                <p className="sub-text">followed by user</p>
                            </div>
                            <button className="action-btn">follow</button>
                        </div>
                        <div className="profile-card">
                            <div className="profile-pic">
                                <img src={cover_6} alt="" />
                            </div>
                            <div>
                                <p className="username">Vishal Kumar Sahu</p>
                                <p className="sub-text">followed by user</p>
                            </div>
                            <button className="action-btn">follow</button>
                        </div>
                        <div className="profile-card">
                            <div className="profile-pic">
                                <img src={cover_5} alt="" />
                            </div>
                            <div>
                                <p className="username">Vishal Kumar Sahu</p>
                                <p className="sub-text">followed by user</p>
                            </div>
                            <button className="action-btn">follow</button>
                        </div>
                        <div className="profile-card">
                            <div className="profile-pic">
                                <img src={cover_4} alt="" />
                            </div>
                            <div>
                                <p className="username">Vishal Kumar Sahu</p>
                                <p className="sub-text">followed by user</p>
                            </div>
                            <button className="action-btn">follow</button>
                    </div> */}
                        
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
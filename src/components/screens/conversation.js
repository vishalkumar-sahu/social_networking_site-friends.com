import React, { useEffect, useState, useContext } from 'react'
import '../../styles/conversation.css'

import { UserContext } from "../../App";
import axios from 'axios';

const Conversation = ({conversation, currentUser}) => {

  const {state, dispatch} = useContext(UserContext)
  const [user, setUser] = useState(null)
  
  // console.log(conversation)

  // useEffect(()=>{
  //   const friendId = conversation.members.find((m) => m !== currentUser._id)

  //   const getUser = async () =>{
  //     try {
  //       const res = await axios(`/user/` + friendId )
  //        setUser(res.data)
  //        console.log(user)
  //     } catch (err) {
  //       console.log(err)
  //     }
      
  //   }
  //   getUser();

  // }, [currentUser, conversation])

  useEffect(()=>{
    const friendId = conversation.members.find((m) => m !== currentUser._id)
        
    fetch(`https://friends-com-backend.onrender.com/user/${friendId}`, {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("jwt")
        }
    }).then(res=> res.json())
    .then(result =>{
        console.log(result)
        setUser(result.user)
        // console.log(result.user.username)
        
    })
}, [currentUser, conversation]);

  return (
    <>
        {/* <div className="conversation">
            <img className='conversationImg' src={state.pic} alt='' />
            <span className="conversationName">{state.username}</span>
        </div> */}
        <div className="conversation">
            <img className='conversationImg' src={user ? user.pic : "loading..."} alt='' />
            <span className="conversationName">{user ? user.username : "loading..."}</span>
        </div>
    </>
  )
}

export default Conversation
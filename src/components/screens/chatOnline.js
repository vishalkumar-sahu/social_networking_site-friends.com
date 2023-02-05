import React, { useEffect, useState } from 'react'
import '../../styles/chatOnline.css'

import { UserContext } from "../../App";
import { useContext } from 'react';

const ChatOnline = ({onlineUsers, currentId, setCurrentChat}) => {

  const {state, dispatch} = useContext(UserContext)
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  console.log(onlineUsers)
  useEffect(()=>{
    async function fetchData(){
      await fetch(`https://friends-com-backend.onrender.com/user/friends/${currentId}`, {
          headers:{
              "Authorization":"Bearer " + localStorage.getItem("jwt")
          }
      }).then(res=> res.json())
      .then(result =>{
          console.log(result)
          setFriends(result);
          console.log(friends)
      })
    };
    fetchData();
  }, [currentId]);
  
  useEffect(() =>{
    // console.log(onlineUsers)
    console.log(friends)
    if(friends.length >= 0){
      setOnlineFriends(friends?.filter((f) => onlineUsers?.includes(f?._id)));
    }
    
    // console.log(onlineFriends)
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    async function fetchData(){
      await fetch(`https://friends-com-backend.onrender.com/chat/find/${currentId}/${state?._id}`, {
          headers:{
              "Authorization":"Bearer " + localStorage.getItem("jwt")
          }
      }).then(res=> res.json())
      .then(result =>{
          setCurrentChat(result)
      })
    };
    fetchData();
  };


  return (
    <>
        <div className="chatOnline">
          {onlineFriends.map(o =>(

              <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
                  <div className="chatOnlineImgContainer">
                      {/* <img className='chatOnlineImg' src="https://res.cloudinary.com/vishalkumar-sahu/image/upload/v1649743446/flfidrlcetzb3hr5iwed.jpg" alt="" /> */}
                      <img className='chatOnlineImg' src={o ? o.pic : "loading..."} alt="" />
                      <div className="chatOnlineBadge"></div>
                  </div>
                  <span className='chatOnlineName'>{o ? o.username : "loading..."}</span>
              </div>

          ))};
        </div>
    </>
  )
}

export default ChatOnline
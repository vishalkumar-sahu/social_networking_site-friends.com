import React from 'react'
import '../../styles/chat.css'
import axios from 'axios'

import logo from '../../img/home/logo.PNG'
import home from '../../img/home/home.PNG'
import messenger from '../../img/home/messenger.PNG'
import add from '../../img/home/add.PNG'
import like from '../../img/home/like.PNG'
import logout from '../../img/home/outline_logout_black_24dp.png'

import { UserContext } from "../../App";
import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom'

import M from 'materialize-css'
import Conversation from './conversation'
import Message from './message'
import ChatOnline from './chatOnline'

import {io} from "socket.io-client"

const Chat = () => {

    const navigate = useNavigate()
    const {state, dispatch} = useContext(UserContext)
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef();

    const socket = useRef(io("ws://localhost:2003"))

    useEffect(() =>{
        socket.current = io("ws://localhost:2003")
        socket.current.on("getMessage", data =>{
            setArrivalMessage({
                sender : data.senderId,
                text : data.text,
                createdAt : Date.now(),
            })
        })
    }, []);

    useEffect(() =>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages(prev => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(()=>{
        socket.current.emit("addUser", state?._id)
        socket.current.on("getUsers", users =>{
            // console.log(users)
            // console.log(state)
            if(state != null){
                setOnlineUsers(state.following?.filter(f => users.some((u) => u?.userId === f)));
            }
            else{
                const val = localStorage.getItem("user");
                setOnlineUsers(val?.following?.filter(f => users.some((u) => u?.userId === f)));
            }
            console.log(onlineUsers)
        })
    }, [state])

    const logoutUser = ()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        M.toast({html: "Successfully logout !!", classes:"#43a047 green darken-1"})
        navigate('/')
    }

    // // const userId;
    // useEffect(()=>{
    //     const getConversations = async () =>{
    //         try {
    //             const res = await axios.get(`/chat/conversation/` + state ? state._id : "loading...")
    //             console.log(res.data)
    //             setConversations(res.data)
    //             console.log(conversations)
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     getConversations()
    // }, [state ? state._id : "loading..."]);

    useEffect(()=>{
        async function fetchData(){
            await fetch(`https://friends-com-backend.onrender.com/chat/conversation/${state ? state._id : "loading..."}`, {
                headers:{
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                }
            }).then(res=> res.json())
            .then(result =>{
                console.log(result)
                setConversations(result)
                
            })
        };
        fetchData();
    }, [state ? state._id : "loading..."]);

    // console.log(currentChat);
    useEffect(()=>{
        console.log(currentChat);
        async function fetchData(){
            await fetch(`https://friends-com-backend.onrender.com/chat/messages/${currentChat?._id}`, {
                headers:{
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                }
            }).then(res=> res.json())
            .then(result =>{
                console.log(result)
                setMessages(result)
                
            })
        };
        fetchData();
    }, [currentChat]);

    const receiverId = currentChat?.members.find(member => member !== state._id)

    const handleSubmit = (e) =>{
        e.preventDefault();

        socket.current.emit("sendMessage", {
            senderId : state._id,
            receiverId,
            text : newMessage,
        })
        
        async function fetchData(){
            await fetch(`https://friends-com-backend.onrender.com/chat/messages/`, {
                method:"post",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    conversationId : currentChat._id,
                    sender : state._id,
                    text : newMessage,
                })
            }).then(res=> res.json())
            .then(result =>{
                console.log(result)
                setMessages([...messages, result])
                setNewMessage("")
            })
        };
        fetchData();

    };

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior : "smooth"})
    }, [messages]);

    return (
        <>
        <div key={0} className="div_chat">
            <nav className="navbar">
                <div key={1} className="nav-wrapper">
                        <img key={2} src={logo} className="brand-img" alt="" onClick={()=> navigate('/home')} />
                        <input key={3} type="text" className="search-box" placeholder="search" />
                        <div key={4} className="nav-items">
                            <img key={5} src={home} className="icon" alt="" onClick={()=> navigate('/home')} />
                            <img key={6} src={messenger} className="icon" alt="" />
                            <img key={7} src={add} className="icon" alt="" onClick={()=> navigate('/createpost')} />
                            <img key={8} src={like} className="icon" alt="" />
                            <img key={9} className="icon user-profile" src={state ? state.pic : "loading..."} onClick={()=> navigate('/profile')} />
                            <img key={10} src={logout} className="icon" id='logout' alt="" onClick={()=>logoutUser()} />
                        </div>  
                </div>
            </nav>

            <div key={11} className='chat'>
                <div key={12} className='chatMenu'>
                    <div  key={13} className="chatMenuWrapper">
                        <input key={14} placeholder='Search...' className='chatMenuInput' />
                        {
                            conversations.map((item)=>(
                                <div onClick={()=>setCurrentChat(item)}>
                                    <Conversation conversation={item} currentUser={state} />
                                </div>
                            ))
                        }
                        
                    </div>
                </div>
                <div key={16} className='chatBox'>
                    <div key={17} className="chatBoxWrapper">
                    {
                        currentChat ?
                        <>
                            <div key={18} className="chatBoxTop"> 
                                {
                                    messages.map(m =>(
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === state._id} />  
                                        </div>
                                    )) 
                                }
                                           
                            </div>
                            <div key={20} className="chatBoxBottom">
                                <textarea key={21}
                                    className='chatMessageInput' 
                                    placeholder='write something...'
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    value= {newMessage}
                                ></textarea>
                                <button key={22} className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                            </div>
                        </>
                        : <span key={23} className='noConversationText'>Open a conversation to start a chat.</span>
                    }
                    </div>
                </div>
                <div key={24} className='chatOnline'>
                    <div key={25} className="chatOnlineWrapper">
                        <ChatOnline 
                            onlineUsers={onlineUsers} 
                            currentId={state ? state._id : "loading..."} 
                            setCurrentChat={setCurrentChat} 
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Chat
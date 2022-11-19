import React, {useEffect, useContext, createContext, useReducer} from 'react';
import './App.css';

import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './components/screens/home.js';
import Signin from './components/screens/login.js';
import Signup from './components/screens/signup.js';
import Create_post from './components/screens/create_post.js';
import Profile from './components/screens/profile';
import UserProfile from './components/screens/userProfile';
import Profile_pic  from './components/screens/profile_pic';
import EnterOtp from './components/screens/enterotp';
import ForgetPassword from './components/screens/forgetPassword';
import ForgetPasswordOtp from './components/screens/verifyForget';
import ChangePassword from './components/screens/changePassword';
import Chat  from './components/screens/chat';

import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = ()=>{
  const navigate = useNavigate()
  const {state, dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload: user})
      // console.log(user)
      // navigate('/home')
    }
    else{
      navigate('/')
    }
  }, []);

  return(
    <Routes>
        <Route exact path='/' element={<Signin />} />
        <Route path='/verifyOtp' element={<EnterOtp />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/createPost' element={<Create_post />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route path='/profile/:userid' element={<UserProfile />} />
        <Route path='/profile/profilePic' element={<Profile_pic />} />
        <Route path='/forgettenPassword' element={<ForgetPassword />} />
        <Route path='/verifyForgetPasswordOtp' element={<ForgetPasswordOtp />} />
        <Route path='/changePassword' element={<ChangePassword />} />
        <Route path='/chat' element={<Chat />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

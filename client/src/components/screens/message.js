import React from 'react'
import '../../styles/message.css'

import {format} from "timeago.js"

import { UserContext } from "../../App";
import { useContext } from 'react';

const Message = ({message, own}) => {

    const {state, dispatch} = useContext(UserContext)

    return (
        <>
            <div className={own ? "message own" : "message"}>
                <div className="messageTop">
                    <img className='messageImg' src={state ? state.pic : "loading..."} alt="" />
                    <p className='messageText'>
                        {
                            message.text
                        }
                    </p>
                </div>
                <div className="messageBottom">{format(message.createdAt)}</div>
            </div>
        </>
    )
}

export default Message
import React, {useState, useEffect} from "react";
import { dummyRecentMessagesData } from "../assets/assets";
import {Link} from 'react-router-dom';
import moment from 'moment';

const RecentMessages = () => {
    const [messages, setMessages] = useState([]);

    const fetchRecentMessages = async () => {
        setMessages(dummyRecentMessagesData);
    }

    useEffect(()=>{
        fetchRecentMessages();
    },[]);

    return (
        <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs">
            <h3 className="font-semibold text-slate-800 mb-2">Recent Messages</h3>
            <div className="flex flex-col max-h-56 overflow-y-auto no-scrollbar -mr-2 pr-2">
                {messages.map((message, index)=>(
                    <Link to={`/messages/${message.from_user_id._id}`} key={index} className='flex items-start gap-3 p-2 hover:bg-slate-100 rounded-lg'>
                        {/* Profile Picture */}
                        <img 
                            src={message.from_user_id.profile_picture} 
                            alt=''
                            className="w-9 h-9 rounded-full flex-shrink-0"
                        />
                        {/* Message Content */}
                        <div className="flex-1 overflow-hidden">
                            {/* Top row: Name and Time */}
                            <div className="flex items-center justify-between w-full">
                                <p className="font-semibold text-slate-800 truncate">{message.from_user_id.full_name}</p>
                                <p className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{moment(message.createdAt).fromNow()}</p>
                            </div>
                            {/* Bottom row: Message and Unread indicator */}
                            <div className="flex items-start justify-between text-slate-500 mt-1">
                                <p className="truncate w-4/5">{message.text ? message.text : 'Media'}</p>
                                {!message.seen && (
                                    <span className="bg-indigo-500 text-white size-4 flex items-center justify-center rounded-full text-[10px] font-bold">1</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default RecentMessages;
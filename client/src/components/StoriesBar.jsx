import React, { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from 'moment';
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import api from '../api/axios.js'
const StoriesBar = () => {

    const {getToken} = useAuth()
    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewStory, setViewStory] = useState(null);

    const fetchStories = async () => {
        try{
            const token = await getToken()
            const {data} = await api.get('/api/story/get', {
                headers : {Authorization: `Bearer ${token}`}
            })
            if(data.success){
                setStories(data.stories)
            } else {
                toast.error(error.message)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className="w-full lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
            <div className='flex gap-4 pb-5'>
                {/* Create Story Card */}
                <div onClick={() => setShowModal(true)} className='relative rounded-lg shadow-sm w-32 h-48 flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-400 bg-gradient-to-b from-indigo-50 to-white'>
                    <div className='h-full flex flex-col items-center justify-center p-2'>
                        <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-2'>
                            <Plus className='w-5 h-5 text-white'/>
                        </div>
                        <p className="text-sm font-medium text-slate-700 text-center">Create Story</p>
                    </div>
                </div>

                {/* Individual Story Cards */}
                {stories.map((story, index) => (
                    <div 
                        onClick={() => setViewStory(story)} 
                        key={index} 
                        className={`relative rounded-lg shadow w-32 h-48 flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 overflow-hidden group`}
                    >
                        {/* Background Media (Image/Video) */}
                        {story.media_type !== 'text' ? (
                            <div className="absolute inset-0 z-0 bg-black">
                                {story.media_type === 'image' ?
                                    <img src={story.media_url} alt='' className='h-full w-full object-cover group-hover:scale-110 transition duration-500'/>
                                    :
                                    <video src={story.media_url} className='h-full w-full object-cover group-hover:scale-110 transition duration-500'></video>
                                }
                            </div>
                        ) : (
                            <div className="h-full w-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                        )}

                        {/* Overlay and Content */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-between p-2 bg-gradient-to-b from-black/40 via-transparent to-black/60">
                            {/* Profile Picture */}
                            <img 
                                src={story.user.profile_picture} 
                                alt='' 
                                className="size-8 rounded-full ring-2 ring-white shadow"
                            />

                            {/* Text Content */}
                            <div className="text-white">
                                <p className="text-sm font-semibold truncate">{story.user.full_name}</p>
                                <p className="text-xs">{moment(story.createdAt).fromNow()}</p>
                            </div>
                        </div>    
                    </div>    
                ))}
            </div>

            {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories}/>}
            {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory}/>}
        </div>
    );
}

export default StoriesBar;
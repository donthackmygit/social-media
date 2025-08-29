import { BadgeCheck, MessageCircle, Heart, Share2 } from "lucide-react"; // Import Share2
import moment from "moment";    
import React,{useState} from "react";
import {useNavigate} from 'react-router-dom'
import {dummyUserData} from '../assets/assets'

const PostCard = ({ post }) => {
    // Đảm bảo post.content tồn tại trước khi sử dụng replace
    const postWithHashTags = post.content ? post.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>') : '';
    
    // Khởi tạo `likes` với mảng rỗng nếu `post.like_count` không phải là mảng hoặc undefined
    const [likes, setLikes] = useState(post.like_count || []); // Sửa setLieks thành setLikes và thêm || []
    
    const currentUser = dummyUserData; // Giả sử dummyUserData có cấu trúc user object với _id

    const handleLike = async () => {
        // Logic xử lý like ở đây
        // Ví dụ:
        // if (likes.includes(currentUser._id)) {
        //     setLikes(likes.filter(id => id !== currentUser._id));
        // } else {
        //     setLikes([...likes, currentUser._id]);
        // }
    }
    const navigate = useNavigate()
    return (
        <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
            <div onClick={() => navigate('/profile/' + post.user._id)} className="inline-flex items-center gap-3 cursor-pointer">
                <img src={post.user.profile_picture} alt='' className="w-10 h-10 rounded-full shadow"/>
                <div>
                    <div className="flex items-center space-x-1">
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className="w-4 h-4 text-blue-500"/>
                    </div>
                    <div className="text-gray-500 text-sm">@{post.user.username} * {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>

            {post.content && <div className="text-gray-800 text-sm whitespace-pre-line" dangerouslySetInnerHTML={{__html:postWithHashTags}}/>}

            <div className="grid grid-cols-2 gap-2">
                {post.image_urls && post.image_urls.map((img,index) => ( // Thêm kiểm tra post.image_urls
                    <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} alt=''/>
                ))}
            </div>

            <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
                <div className="flex items-center gap-1">
                    {/* Đảm bảo currentUser và currentUser._id tồn tại trước khi kiểm tra includes */}
                    <Heart className={`w-4 h-4 cursor-pointer ${currentUser && currentUser._id && likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
                    <span>{likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className='w-4 h-4'/>
                    <span>{12}</span> {/* Giá trị cứng này có thể cần được thay thế bằng post.comment_count */}
                </div>
                <div className="flex items-center gap-1">
                    <Share2 className='w-4 h-4'/>
                    <span>{7}</span> {/* Giá trị cứng này có thể cần được thay thế bằng post.share_count */}
                </div>
            </div>
        </div>
    )
}

export default PostCard
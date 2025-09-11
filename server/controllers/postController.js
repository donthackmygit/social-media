import fs from 'fs'
import imageKit from '../configs/imageKit.js'
import Post from '../models/Post.js'
import User from '../models/User.js'
//Add Post
export const addPost = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {content, post_type} = req.body;
        const images = req.files

        let image_urls = []

        if(images.length){
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imageKit.upload({
                        file: fileBuffer,
                        fileName: cover.originalname,
                        folder: 'posts'
                    });
                    
                    const url = imageKit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: 'auto' },
                            { format: 'webp' },
                            { width: '1280' }
                        ]
                    })
                    return url
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        res.json({success: true, message: 'Post created successfully'})
    } catch(error) { 
        console.log(error);
        res,json({success: false, message: error.message})
    }
} 

export const getFeedPosts = async (req, res) => {
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId)

        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({user: {$in: userIds}}).populate('user').sort({createdAt: -1});

        res.json({success: true, posts})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export const likePost = async (req, res) => {
    try{
        const {userId} = req.auth()
        const {postId} = req.body;

        const post = await Post.findById(postId)

        if(post.likes_count.includes(userId)){
            post.likes_count_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({success: true, message: 'Post unliked'})
        } else {
            post.likes_count.push(userId) 
            await post.save()
            res.json({success: true, message: 'Post liked'});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
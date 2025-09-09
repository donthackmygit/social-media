import User from "../models/User.js";
import fs from 'fs';
import imageKit from '../configs/imageKit.js';
import Connection from '../models/Connection.js';

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Bạn đã quên trả về dữ liệu người dùng ở đây
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        // Sử dụng let để có thể gán lại giá trị cho username
        let { username, bio, location, full_name } = req.body;
        const tempUser = await User.findById(userId);

        if (!tempUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Nếu không có username mới, giữ lại username cũ
        if (!username) {
            username = tempUser.username;
        }

        // Kiểm tra xem username mới đã tồn tại chưa (và nó không phải là của người dùng hiện tại)
        if (tempUser.username !== username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                // Trả về lỗi thay vì âm thầm đổi lại username cũ
                return res.status(400).json({ success: false, message: 'Username already taken' });
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        };

        const profile = req.files.profile && req.files.profile[0];
        const cover = req.files.cover && req.files.cover[0];

        if (profile) {
            const buffer = fs.readFileSync(profile.path);
            const response = await imageKit.upload({
                file: buffer,
                fileName: profile.originalname
            });

            const url = imageKit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '512' }
                ]
            });
            updatedData.profile_picture = url;
        }

        if (cover) {
            const buffer = fs.readFileSync(cover.path);
            const response = await imageKit.upload({
                file: buffer,
                // Sửa lỗi: sử dụng cover.originalname thay vì profile.originalname
                fileName: cover.originalname
            });

            const url = imageKit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            });
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        res.json({ success: true, user, message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { input } = req.body;

        const allUsers = await User.find({
            // Đảm bảo không tìm thấy chính người dùng hiện tại
            _id: { $ne: userId },
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') },
            ]
        });
        
        // Không cần filter lại vì đã xử lý trong query
        res.json({ success: true, users: allUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body; // id của người muốn follow

        // Cập nhật người dùng hiện tại (thêm id vào 'following')
        await User.findByIdAndUpdate(userId, { $addToSet: { following: id } });

        // Cập nhật người được follow (thêm userId vào 'followers')
        await User.findByIdAndUpdate(id, { $addToSet: { followers: userId } });

        res.json({ success: true, message: 'Now you are following this user' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        // Cập nhật người dùng hiện tại (xóa id khỏi 'following')
        await User.findByIdAndUpdate(userId, { $pull: { following: id } });

        // Cập nhật người đã từng được follow (xóa userId khỏi 'followers')
        await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
        
        // Sửa lỗi chính tả 'messsage' -> 'message'
        res.json({ success: true, message: 'You are no longer following this user' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const connectionRequests = await Connection.find({ from_user_id: userId, createdAt: { $gt: last24Hours } });
        if (connectionRequests.length >= 20) {
            return res.status(429).json({ success: false, message: 'You have sent more than 20 connection requests in the last 24 hours' });
        }
        
        // Sửa lỗi: findOnd -> findOne
        const connection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId }
            ]
        });

        if (!connection) {
            await Connection.create({
                from_user_id: userId,
                to_user_id: id
            });
            return res.json({ success: true, message: 'Connection request sent successfully' });
        } else if (connection.status === 'accepted') {
            // Sửa lỗi: Thông báo không chính xác
            return res.status(400).json({ success: false, message: 'You are already connected' });
        } else if (connection.status === 'pending') {
            return res.status(400).json({ success: false, message: 'Connection request already pending' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth(); // người nhận request
        const { id } = req.body; // người gửi request

        // Sửa lỗi: findOnd -> findOne
        const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId, status: 'pending' });

        if (!connection) {
            return res.status(404).json({ success: false, message: 'Connection request not found or already accepted' });
        }
        await User.findByIdAndUpdate(userId, { $addToSet: { connections: id } });
        await User.findByIdAndUpdate(id, { $addToSet: { connections: userId } });
        
        connection.status = 'accepted';
        await connection.save();

        res.json({ success: true, message: 'Connection accepted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserConnections = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId).populate('connections followers following');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const connections = user.connections;
        const followers = user.followers;
        const following = user.following;

        const pendingConnections = (await Connection.find({ to_user_id: userId, status: 'pending' }).populate('from_user_id', 'username profile_picture full_name')).map(connection => connection.from_user_id);

        res.json({ success: true, connections, followers, following, pendingConnections });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
import mongoose from "mongoose";

const connectDB = async (params) => {
    try{
        mongoose.connection.on('connected', () => console.log('Database connected'))
        await mongoose.connect(`${process.env.MONGODB_URL}/socialMedia`)
    } catch(error) {
        console.log(error.message)
    }
}

export default connectDB
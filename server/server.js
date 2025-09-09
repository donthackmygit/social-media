import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest, functions} from './inngest/index.js'
import {serve} from 'inngest/express'
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';
console.log('IMAGEKIT_PUBLIC_KEY:', process.env.IMAGEKIT_PUBLIC_KEY);
console.log('IMAGEKIT_PRIVATE_KEY:', process.env.IMAGEKIT_PRIVATE_KEY);
console.log('IMAGEKIT_URL_ENDPOINT:', process.env.IMAGEKIT_URL_ENDPOINT);
const app = express();

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/',(req, res) => res.send('Server is running'))
app.use('/api/inngest',serve({ client: inngest, functions }))
app.use('/api/user',userRouter)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import connectionReducer from '../features/user/connectionSlice.js'
import messagesReducer from '../features/user/messagesSlice.js'
export const store = configureStore({
    reducer: {
        user: userReducer,
        connections: connectionReducer,
        messages: messagesReducer
    }
})
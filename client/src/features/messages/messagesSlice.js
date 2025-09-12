import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../../api/axios.js'
const initialState = {
    messages: []
}

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async ({token, userId}) => {
    const {data} = await api.pst('/api/message/get', {to_user_id: userId}, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data.success ? data : null
})
const messagesSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessages: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        resetMessages: (state) => {
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, () => {
            if(action.payload){
                state.message = action.payload.messages
            }
        })
    }
})

export const {setMessages, addMessages, resetMessages} = messagesSlice.actions;
export default messageSlice.reducer
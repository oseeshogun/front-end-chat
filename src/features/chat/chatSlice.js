import { createSlice } from '@reduxjs/toolkit'
import { getUniqueItemsByProperties } from '../../utils/utils'

const initialState = {
  messages: [],
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      if (
        state.messages.findIndex((message) => message.id === payload.id) === -1
      ) {
        state.messages = [...state.messages, payload]
      }
    },
    addManyMessages: (state, { payload }) => {
      for (let currentMessage of payload) {
        if (
          state.messages.findIndex(
            (message) => message.id === currentMessage.id
          ) === -1
        ) {
          console.log(currentMessage)
          state.messages = [...state.messages, currentMessage]
        }
      }
    },
  },
})

export const { addMessage, addManyMessages } = chatSlice.actions

export default chatSlice.reducer

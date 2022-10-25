import React from 'react'
import Chatting from '../../../assets/images/Messaging-rafiki.svg'

const ChatPlaceholder = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <img src={Chatting} alt="Chat" className="h-[70vh]" />
    </div>
  )
}

export default ChatPlaceholder

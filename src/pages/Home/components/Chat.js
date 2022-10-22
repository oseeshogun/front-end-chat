import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { socket } from '../../../App'
import { getChatId } from '../../../utils/utils'
import { addManyMessages, addMessage } from '../../../features/chat/chatSlice'
import httpClient from '../../../utils/client'

const Chat = () => {
  const { id } = useParams()
  const token = useSelector((state) => state.user.token)
  const users = useSelector((state) => state.user.users)
  const allMessages = useSelector((state) => state.chat.messages)
  const user = useSelector((state) => state.user.data)
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (users.length === 0) return () => {}
    const chatter = users.find((user) => user.id === id)
    const chatId = getChatId(chatter.id, user.id)
    const messages = allMessages.filter((message) => message.chatId === chatId)
    if (messages.length !== 0) return () => {}
    httpClient(token)
      .get('/chats/messages', {
        params: {
          chatId,
        },
      })
      .then((response) => {
        console.log(response.data)
        const messages = response.data.map((message) => ({
          id: message.localId,
          text: message.text,
          chatId,
          sender: { id: message.sender },
          receiver: { id: message.receiver },
        }))
        dispatch(addManyMessages(messages))
      })
      .catch((err) => console.log(err))
  }, [allMessages, dispatch, id, token, user.id, users])

  if (users.length === 0) {
    return (
      <>
        <Navigate to="/" />
      </>
    )
  }

  const chatter = users.find((user) => user.id === id)
  const chatId = getChatId(chatter.id, user.id)
  const messages = allMessages.filter((message) => message.chatId === chatId)

  const sendText = (e) => {
    e.preventDefault()
    const message = {
      text,
      id: uuidv4(),
      sender: user,
      receiver: chatter,
      chatId,
    }
    socket.emit('text', message)
    dispatch(addMessage(message))
    setText('')
  }

  return (
    <div className="p-2 h-full bg-gray-200 lg:rounded-2xl flex flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-300 pb-3">
        <Link to="/">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAAvUlEQVRoge3ZwQqCUBRF0U0fmBWFg/r3oMACP8HABjYIew28Du7hcRY49mzUgQpmVdsDD6AHjslbwlpgAMbP0efOiZlHjMAzdVFAKWIADpmjljrxG/ECzpmjlnKECkeocIQKR6hwhApHqHCEiioidpRfitrMURF3xCI2mSdXUM2tBdP3p9LDfskcFeUYVY5R5RhVjlHlGFWOUeUYVVXF/PsZ2mSOiirF3FIXrTCP6XLnrNMAV6arsU3eYvbtDV2c58xqHOMTAAAAAElFTkSuQmCC"
            alt="Retour"
            className="h-[30px] w-[30px]"
          />
        </Link>
        <div className="flex items-center">
          <h4 className="mr-4 font-bold text-xl">{chatter.username}</h4>
          <img
            src={`https://i.pravatar.cc/250?index=${chatter.id}`}
            alt="Contact"
            className="h-[50px] w-[50px] object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-grow py-2 px-1">
        {messages.length > 0 ? <Messages messages={messages} /> : null}
      </div>
      <form
        onSubmit={sendText}
        className="w-full bg-white flex rounded-2xl p-1"
      >
        <input
          type="text"
          className="w-full rounded-2xl px-3 py-1 resize-none scrollbar-none outline-none"
          placeholder="Votre Message..."
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          {text ? (
            <button
              type="submit"
              className="rounded-full bg-slate-50 h-[50px] w-[50px] flex items-center justify-center"
            >
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEbElEQVRoge2YzU9cVRiHn3PO/ZgZBgYKVLFNjDsjIbqSFpO68CPGxvDRjHTTpIl/golbMX4vjBtdGVcu3BibJmpSo8ZYLCQuKlalxkjTATuF1gEGkPlg7nFBpzMw9965d2CgJjzLmXPe9/d7z3vOPffCAQcc8L9G7LcAT7QWg/M8Lh1GNQytLhbWvum1+7YPM/ZDmx9Dc/oxLRkVaUaBhzSwksnzb7a44Tb+njAwmNaPCIcXtWAUeLi6LVYyebL/5InEjSm3uftmYOSGftCBIQ1JoXkCUdvPZfEA0pQfusXZ0z0wMqePOpJTGpICBvzyV4tXhtyYHIjbCOFsH9f0FRie052O4qTQnHHgKUD4Va1UdJifXUWXKr9ZlvrJTTw0ycDJ67rDsHhBOCS14Dmhg+VZXFjn+m9LHLo/ijJkRaTN+15zdq2FkhmdKOQZFA5JBM8CVtC5pQ2H1PQyC6lVOntaiLZW/CpTFiYHWm2vuTtageSsjhYkTwtBspjjlIBY2JIsLeSYuZKhmCsRazO3iAewbDXhNz+0gbPXdGTR4hkhSBZhWEA8bAyAjaLD7NXNqgMoQ9LeHa0VaMv3/OIEqldSa7WR5riGM8BpoC285ApLt3Jc+yVDIVfZqZ0PxIjGzS3jDEutTxyPx/xiea7AmNZyKs2AA8limtPA4Z2Ihq29Xk1Lm1UjHsC0xMV6MV0NDP2tX/k5zcvA4d3a5cu3c8xMba06bLZOojvioU6+Wy+uq76hG/o20BleZi1eVS/TdaSFSEttHQ1brU0ci9fdX9LtR6F5CSiE1FrDSibPr+PznuJjbZareADLkt8FyeFq4NwRcV4LhoF8QK1bcEqa1NVlpicXyK25XiLvnDoerQMok3eC5PJt8cG0fl5oPgc8HyTbWVnMMzOV8RRexqt1AExbZi8da00Eyee6AmXO94ivtGCEACtxt+oT3lUv05Lwbh0A01YX6uUr42sAgplYXcxz5eJN0n9l0do/nu+pw2ZLaMt4u56u6vGBcGsnp6SZ+zPLzZn6wsv4tQ6AGVGZS/3xwCdg3RUos30lVhYLgateJt7u3zoApim/DKoJQhiAionU70ul6Yn5ur1ejWFKEl21d51qBGAJ+XoYTQ09aHs+SgWseSVL99E4dlT5DrMj6tZ4fzzUlSXUCjRKPGHVFQ+gbHUubOymGwjSOrD5nmkr/UbY+M01IKDjvigiQBYrotJf98Vmw6ZoqoF4u40dC/bOpCz5WSM5mmbAsCSJzmA3ECEEhnLebChPI5Pqcrd1gh1yVlSlvu1rmW8kVWMrIBj3+7ut3caOBq+NYapPG9JBk77MnZhafzW3XBgL8oQWUuiOQ61dF3pFppFcTdkDPzwafS2SsMZ8P8HdwYqomUbFQxM3cVAT0pKf7CRPU4/ReiaEFFoaEd/vPvVo+pPYz4QVNf74vle4vzAHZE/uQl4mDJOPdxp7TwxArQmphENb9IO9yr9rPHl5/a3+H7OlE5fXv9hvLQcccMA9wH9yVnqIzvQo3QAAAABJRU5ErkJggg=="
                alt="send"
                className="h-[30px] w-[30px]"
              />
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}

const Messages = ({ messages }) => {
  return (
    <>
      {messages.map((message) => (
        <MessageItem message={message} key={message.id} />
      ))}
    </>
  )
}

const MessageItem = ({ message }) => {
  const user = useSelector((state) => state.user.data)

  const isMine = message.sender.id === user.id

  if (!isMine) {
    return (
      <div className="w-full flex justify-start my-2">
        <div className="w-[40%] px-5 py-2 rounded-2xl bg-slate-300">
          {message.text}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-end my-2">
      <div className="w-[40%] px-5 py-2 rounded-2xl bg-sky-500 text-white text-right">
        {message.text}
      </div>
    </div>
  )
}

export default Chat

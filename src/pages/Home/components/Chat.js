import { useEffect, useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { filesize } from 'filesize'
import { socket } from '../../../App'
import { getChatId } from '../../../utils/utils'
import { addManyMessages, addMessage } from '../../../features/chat/chatSlice'
import httpClient from '../../../utils/client'
import axios from 'axios'

const Chat = () => {
  const { id } = useParams()
  const token = useSelector((state) => state.user.token)
  const users = useSelector((state) => state.user.users)
  const allMessages = useSelector((state) => state.chat.messages)
  const user = useSelector((state) => state.user.data)
  const [text, setText] = useState('')
  const [inputFile, setInputFile] = useState(null)
  const inputFileRef = useRef()
  const formRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (users.length === 0) return () => {}
    const chatter = users.find((user) => user.id === id)
    const chatId = getChatId(chatter.id, user.id)
    const messages = allMessages.filter((message) => message.chatId === chatId)
    if (messages.length > 1) return () => {}
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
          image: message.image,
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

  const sendText = async (e) => {
    e.preventDefault()
    let fileUrl = null
    if (inputFile) {
      const formData = new FormData()
      formData.append('file', inputFile)
      formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET)
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
        formData
      )
      const { url } = response.data
      fileUrl = url
    }
    const message = {
      text,
      id: uuidv4(),
      sender: user,
      receiver: chatter,
      chatId,
      ...(fileUrl && { image: fileUrl }),
    }
    socket.emit('text', message)
    dispatch(addMessage(message))
    setText('')
    setInputFile(null)
    inputFileRef.current.value = ''
    formRef.current.reset()
  }

  const fileChoosen = (e) => {
    const files = e.target.files
    if (files.length === 0) return
    const file = files[0]
    if (file.size > 2097152) {
      alert('Le fichier est trop volumineux')
      return
    }
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      alert("Le fichier n'est pas une image")
      return
    }
    setInputFile(file)
  }

  const removeFile = (e) => {
    setInputFile(null)
    inputFileRef.current.value = ''
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
      <div className="flex-grow overflow-y-scroll scrollbar-thin py-2 px-1">
        {messages.length > 0 ? <Messages messages={messages} /> : null}
      </div>
      {inputFile ? (
        <div className="my-2 flex items-center">
          <img
            src="data:image/png;base64,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"
            alt="Fichier"
          />
          <div className="ml-4 flex-grow">
            <p>{inputFile.name}</p>
            <h2 className="font-bold">
              {filesize(inputFile.size, { base: 2, standard: 'jedec' })}
            </h2>
          </div>
          <button onClick={removeFile}>
            <img
              src="data:image/png;base64,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"
              alt="Effacer"
              className="h-[30px] w-[30px]"
            />
          </button>
        </div>
      ) : null}
      <form
        onSubmit={sendText}
        className="w-full bg-white flex items-center rounded-2xl px-1 py-2"
        ref={formRef}
      >
        <div>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={fileChoosen}
            accept="image/x-png,image/gif,image/jpeg"
            ref={inputFileRef}
          />
          <label
            htmlFor="file"
            className="cursor-pointer rounded-full bg-slate-50 hover:bg-slate-100 h-[50px] w-[50px] flex items-center justify-center"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEk0lEQVRoge2Za2hbZRjHf885abrabpPi1jRtuoo3FP2gA8EhQ1EmdWzgnBcUJhttqjDH2EBE/VCcqPuiKBujbdyYF7yA2xj6QYV6YWBhCN6FOba2ydJOvLbDNmvOefzQnNM4m+RNmrQqfT69l/M8z++f93pOYMEWbMH+0yZzkaT5hXiNs8TdKK51nwrXgi4DUsApQftc5eBIdMV3pcSuuIDGnvjdiL4IRPI85oK+WR1wtw5svvT3YuJXTkCXWqHw0HMi8lgRXidskbWJ9shJUwerBLTC1qVWKBzv/Tu8DIrKNsfl8vqlY9XiBpYh0gYcAjTz0JWO6vutB05fbJqq/CPgw7PFa1J4OzAmmxM7IuMzuYR7htar8AZQN+Ugrw1HI5tM0pVXwEzwyv6RZKSDLnHzuWZEHMkwOeBeN9zR+kOhlOWbQrOAB0hGW44ChzNVG2yjESiPgFnCT/tILKt2m4nP7AWUCR7AUvt4VrXVyKeYBP+wMsIDBIOpc1nVWhOf0gWUGR5gcrKqxa8IP5n4BEpJVBC+S63GpsQ+VFtFA3clO8N/moR1cdr8jVH5ysSneAEG8KFwvBfYgoCSPgzcUShsuDt5kUp6p1cXkXdMcIqbQobw2f2IDJjExUofwL8vyaA16m+pec18BEqAn+pvfsQkrsK9XpOIbk/saJnx1L7QzEZAVRqb4ntzwhfqLyIuyPPJ9pYjRlyYXCVK/uULwJdpFys4AuFwfPe/FR4KjECod3CTIAfnFN7bgtEWe0w25LrBepZzETfsO7lcYM90i74+kmypOLy/BQPOYj0EtOUTkHMKWVXVT4AsBhDorx0/3+4t2ErCX7Cgh/LB5xTQ8OpILarRTNV1XIme3HZFCqAxFt81F/Cq7B8+U2ALziXAmphcA9QAIHr4bGfkG4Bw98ANwONzAW+6oGeeQqJr/LJr+Seiir0dsKcqfDjf8LkFZN3FHdX+LGG3+IngqfmGzyeg2WeuCY5ktV/iFeomUl/PN3weATLplWqc8aqsjj+8wrm64GXzDZ9HgP7ilcYdu3m6XY75JUeenG94yHGQiXBCldsBbFduBb7NJNsjwsbMYw+EYkN16sizuKnTYldfLRJ/Glg9V/CQew185CcR7vfKI9HIpyA9vlBlvWVpvxUInhXRT7LhgVcqDZ9TwMSiVB/KaCbVqlBP3D/O65eOPpotYgZzBHYNt1ceHvJc5hp7h54BvHmemHTdG3/ubB32+2NDq0Vlq6KrQJeA/CZCn7jWS2eizV8CFXnxNxbQHIvXO6rfAw2Zpi8mXXddtoh81nrg9KJU2oqBPOi1lRse8lzmEu2RX4F7BLwtdWWVZR0PxQbWFgoajg1cn0rbn1UaHgzeyEKxwYcslV4F/zxQ9HML3nJc6+Nqx02k6qrPBybSTY7l3ASyQZR12bEF9ibPRLaVG95IAEC4e/BmtXgXZHmR8dOC7kx2rHi5BDYjM3qpT3auOGYF7WtUZDdg8rVABXnPRlZWEh5K+H9gee+phoBUrVPVO1GuQmgEgghJlAGFDwKOHE08HPmxArwLtmAL9n+zvwB6AE8Izr8njQAAAABJRU5ErkJggg=="
              alt="Fichier"
              className="h-[30px] w-[30px]"
            />
          </label>
        </div>
        <input
          type="text"
          className="w-full rounded-2xl px-3 py-1 resize-none scrollbar-none outline-none"
          placeholder="Votre Message..."
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          {text || inputFile ? (
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
        {message.image ? (
          <div>
            <img src={message.image} alt="Message Media" />
          </div>
        ) : null}
        <div>{message.text}</div>
      </div>
    </div>
  )
}

export default Chat

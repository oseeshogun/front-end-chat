import React, { useEffect } from 'react'
import httpClient from '../../../utils/client'
import { useDispatch, useSelector } from 'react-redux'
import { setUsers } from '../../../features/user/userSlice'
import { Link } from 'react-router-dom'
import { addManyMessages } from '../../../features/chat/chatSlice'
import { getChatId } from '../../../utils/utils'

const ContactList = ({ className }) => {
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.data)
  const users = useSelector((state) => state.user.users)

  const dispatch = useDispatch()

  useEffect(() => {
    httpClient(token)
      .get('/users')
      .then((response) => {
        console.log(response.data)
        dispatch(setUsers(response.data))
      })
      .catch((err) => {
        console.log(err)
      })

    httpClient(token)
      .get('/chats/first')
      .then((response) => {
        console.log(response.data)
        const messages = response.data.map((info) => ({
          id: info.message.localId,
          text: info.message.text,
          chatId: info.chatId,
          image: info.message.image,
          sender: { id: info.message.sender },
          receiver: { id: info.message.receiver },
        }))
        dispatch(addManyMessages(messages))
      })
      .catch((err) => {
        console.log(err)
      })
  }, [dispatch, token])

  return (
    <div
      className={`px-2 lg:px-0 py-2 lg:py-0 lg:mx-6 absolute lg:static bg-slate-200 lg:bg-inherit w-full lg:w-[30%] h-full flex flex-col ${className}`}
    >
      <div className="bg-sky-500 lg:hidden mb-2 px-3 py-2 rounded-2xl text-white flex justify-between items-center">
        <h4 className="font-bold text-xl">{user.username}</h4>
        <img
          src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
          alt="Profile d'utilisateur"
          className="rounded-full w-[50px] h-[50px] object-cover"
        />
      </div>
      <div className="w-full">
        <div className="w-full px-5 py-2 rounded-2xl bg-white flex items-center">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABiUlEQVRIie2Wu04CQRSGP0G2EUtIbHwA8B3EQisLIcorEInx8hbEZ9DKy6toDI1oAgalNFpDoYWuxZzJjoTbmSXERP7kZDbZ859vdmb27MJcf0gBUAaugRbQk2gBV3IvmDa0BLwA4Zh4BorTACaAU6fwPXAI5IAliTxwBDScvJp4vWWhH0BlTLEEsC+5Fu6lkgNdV/gKDnxHCw2I9rSiNQNV8baBlMZYJtpTn71KAg9SY3dUYn9xezLPgG8P8BdwLteq5X7CzDbnAbXKS42WxtQVUzoGeFlqdEclxXrnhmhhkqR+8KuMqzHA1vumAddl3IwB3pLxVmOyr1NjwKQmURJ4lBp7GmOAafghpg1qdSDeDrCoNReJWmZB4dsAPsW7rYVa1Rx4FbOEw5TEPKmFvgMZX3DCgYeYNniMaQ5piTXghGhPLdTmZ33hYNpem98f/UHRwSxvhqhXx4anMA3/EmhiOlJPJnSBOb3uQcpOE65VhujPpAms/Bu4u+x3swRbeB24mTV4LgB+AFuLedkPkcmmAAAAAElFTkSuQmCC"
            alt=""
            className="mr-2 opacity-50 w-6 h-6"
          />
          <input
            className="w-full p-1 outline-none"
            placeholder="Rechercher..."
          />
        </div>
      </div>
      <div className="bg-white h-full scrollbar-none overflow-y-scroll rounded-2xl mt-[5%] p-3">
        <h4 className="text-gray-500 text-xl font-bold">Contacts</h4>
        <ul className="list-none py-4">
          {users.map((user, index) => (
            <ContactItem chatter={user} key={user.id} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const ContactItem = ({ chatter }) => {
  const allMessages = useSelector((state) => state.chat.messages)
  const user = useSelector((state) => state.user.data)
  const chatId = getChatId(user.id, chatter.id)
  const messages = allMessages.filter((message) => message.chatId === chatId)
  const message = messages.length > 0 ? messages[messages.length - 1] : null

  return (
    <Link
      className="flex items-center border-b-[1px] border-gray-100 cursor-pointer hover:bg-slate-100 rounded-lg px-4 pt-2 pb-2"
      to={`/chat/${chatter.id}`}
    >
      <img
        src={`https://i.pravatar.cc/250?index=${chatter.id}`}
        alt="Contact"
        className="h-[50px] w-[50px] object-cover rounded-full"
      />
      <div className="ml-4">
        <h5 className="text-2xl font-w600">{chatter.username}</h5>
        {message ? (
          <p className="text-gray-600 text-[14px]">{message.text}</p>
        ) : null}
      </div>
    </Link>
  )
}

export default ContactList

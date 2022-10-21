import { useParams, Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Chat = () => {
  const { id } = useParams()
  const users = useSelector((state) => state.user.users)

  if (users.length === 0) {
    return (
      <>
        <Navigate to="/" />
      </>
    )
  }

  const chatter = users.find((user) => user.id === id)

  return (
    <div className="p-2 h-full bg-slate-200 lg:rounded-2xl flex flex-col">
      <div className="flex justify-between items-center">
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
      <div className="flex-grow py-2 px-1">Messages</div>
      <div className="w-full bg-white flex rounded-2xl p-1">
        <input
          type="text"
          className="w-full rounded-2xl px-3 py-3 outline-none"
          placeholder="Votre Message..."
        />
        <div>
          <button className="rounded-full bg-slate-50 h-[50px] w-[50px] flex items-center justify-center">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEbElEQVRoge2YzU9cVRiHn3PO/ZgZBgYKVLFNjDsjIbqSFpO68CPGxvDRjHTTpIl/golbMX4vjBtdGVcu3BibJmpSo8ZYLCQuKlalxkjTATuF1gEGkPlg7nFBpzMw9965d2CgJjzLmXPe9/d7z3vOPffCAQcc8L9G7LcAT7QWg/M8Lh1GNQytLhbWvum1+7YPM/ZDmx9Dc/oxLRkVaUaBhzSwksnzb7a44Tb+njAwmNaPCIcXtWAUeLi6LVYyebL/5InEjSm3uftmYOSGftCBIQ1JoXkCUdvPZfEA0pQfusXZ0z0wMqePOpJTGpICBvzyV4tXhtyYHIjbCOFsH9f0FRie052O4qTQnHHgKUD4Va1UdJifXUWXKr9ZlvrJTTw0ycDJ67rDsHhBOCS14Dmhg+VZXFjn+m9LHLo/ijJkRaTN+15zdq2FkhmdKOQZFA5JBM8CVtC5pQ2H1PQyC6lVOntaiLZW/CpTFiYHWm2vuTtageSsjhYkTwtBspjjlIBY2JIsLeSYuZKhmCsRazO3iAewbDXhNz+0gbPXdGTR4hkhSBZhWEA8bAyAjaLD7NXNqgMoQ9LeHa0VaMv3/OIEqldSa7WR5riGM8BpoC285ApLt3Jc+yVDIVfZqZ0PxIjGzS3jDEutTxyPx/xiea7AmNZyKs2AA8limtPA4Z2Ihq29Xk1Lm1UjHsC0xMV6MV0NDP2tX/k5zcvA4d3a5cu3c8xMba06bLZOojvioU6+Wy+uq76hG/o20BleZi1eVS/TdaSFSEttHQ1brU0ci9fdX9LtR6F5CSiE1FrDSibPr+PznuJjbZareADLkt8FyeFq4NwRcV4LhoF8QK1bcEqa1NVlpicXyK25XiLvnDoerQMok3eC5PJt8cG0fl5oPgc8HyTbWVnMMzOV8RRexqt1AExbZi8da00Eyee6AmXO94ivtGCEACtxt+oT3lUv05Lwbh0A01YX6uUr42sAgplYXcxz5eJN0n9l0do/nu+pw2ZLaMt4u56u6vGBcGsnp6SZ+zPLzZn6wsv4tQ6AGVGZS/3xwCdg3RUos30lVhYLgateJt7u3zoApim/DKoJQhiAionU70ul6Yn5ur1ejWFKEl21d51qBGAJ+XoYTQ09aHs+SgWseSVL99E4dlT5DrMj6tZ4fzzUlSXUCjRKPGHVFQ+gbHUubOymGwjSOrD5nmkr/UbY+M01IKDjvigiQBYrotJf98Vmw6ZoqoF4u40dC/bOpCz5WSM5mmbAsCSJzmA3ECEEhnLebChPI5Pqcrd1gh1yVlSlvu1rmW8kVWMrIBj3+7ut3caOBq+NYapPG9JBk77MnZhafzW3XBgL8oQWUuiOQ61dF3pFppFcTdkDPzwafS2SsMZ8P8HdwYqomUbFQxM3cVAT0pKf7CRPU4/ReiaEFFoaEd/vPvVo+pPYz4QVNf74vle4vzAHZE/uQl4mDJOPdxp7TwxArQmphENb9IO9yr9rPHl5/a3+H7OlE5fXv9hvLQcccMA9wH9yVnqIzvQo3QAAAABJRU5ErkJggg=="
              alt="send"
              className="h-[30px] w-[30px]"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat

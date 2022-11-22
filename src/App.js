import './App.css'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import Preloader from './components/Preloader'
import ChatPlaceholder from './pages/Home/components/ChatPlaceholder'
import Chat from './pages/Home/components/Chat'
import httpClient from './utils/client'
import {
  setIsAuthenticated,
  setToken,
  setUser,
} from './features/user/userSlice'
import io from 'socket.io-client'
import { addMessage } from './features/chat/chatSlice'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { toast } from 'react-toastify'

const socket = io(process.env.REACT_APP_BASE_URL, {
  reconnection: true,
  autoConnect: false,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000 * 5,
  auth: (cb) => {
    cb({
      token: localStorage.getItem('token'),
    })
  },
})

const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return children
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

const Main = () => {
  // const [notified, setNotified] = useState([])
  const [checkingAuthentication, setCheckingAuthentication] = useState(true)
  const user = useSelector((state) => state.user.data)
  const { receiverId } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(setIsAuthenticated(false))
      setCheckingAuthentication(false)
      return
    }
    console.log('Token ', token)
    httpClient(token)
      .get('/user')
      .then((response) => {
        dispatch(setIsAuthenticated(true))
        dispatch(setUser(response.data))
        dispatch(setToken(token))
      })
      .catch((err) => {
        console.log(err)
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          dispatch(setIsAuthenticated(false))
          return
        }
        alert("Un problème est survenue lors de l'authentification.")
      })
      .finally(() => {
        setCheckingAuthentication(false)
      })
  }, [dispatch])

  useEffect(() => {
    if (!user || socket.connected) return () => {}
    // socket.auth
    socket.connect()
    socket.on('connect', () => {
      console.log('Is connected')
      socket.emit('join', user.id)
    })

    socket.on('new_text', (data) => {
      console.log(data, receiverId !== data.receiver.id)
      if (receiverId !== data.receiver.id) {
        toast(`${data.sender.username}: \n${data.text}`, { toastId: data.id })
      }
      dispatch(addMessage(data))
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [dispatch, user])

  if (checkingAuthentication) {
    return (
      <>
        <Preloader />
      </>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          protected
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }>
          <Route path="" element={<ChatPlaceholder />} />
          <Route path="chat/:receiverId" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export { socket }
export default App

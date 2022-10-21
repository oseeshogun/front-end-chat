import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import Preloader from './components/Preloader'
import ChatPlaceholder from './pages/Home/components/ChatPlaceholder'
import Chat from './pages/Home/components/Chat'
import httpClient from './utils/client'
import { setIsAuthenticated, setToken, setUser } from './features/user/userSlice'

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
  const [checkingAuthentication, setCheckingAuthentication] = useState(true)

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
          }
        >
          <Route path="" element={<ChatPlaceholder />} />
          <Route path="chat/:id" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

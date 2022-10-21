import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import httpClient from '../../utils/client'
import {
  setIsAuthenticated,
  setToken,
  setUser,
} from '../../features/user/userSlice'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const usernameRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  const dispatch = useDispatch()

  const onSubmit = (event) => {
    event.preventDefault()

    if (loading) return

    const [username, password, confirmPassword] = [
      usernameRef.current.value,
      passwordRef.current.value,
      confirmPasswordRef.current.value,
    ]

    if (confirmPassword !== password) {
      return alert('Les mots de passe ne correspondent pas')
    }

    setLoading(true)
    httpClient()
      .post('/register', { username, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token)
        dispatch(setToken(response.data.token))
        dispatch(setIsAuthenticated(true))
        dispatch(setUser(response.data.user))
      })
      .catch((err) => {
        console.log(err)
        if (err.response?.data?.error?.code === 11000) {
          alert("Un compte utilise déjà ce nom d'utilisateur.")
        } else {
          alert("Nous n'avons pas pu vous enregistrer")
        }
      })
      .finally(() => setLoading(false))
  }
  return (
    <section className="h-screen">
      <div className="px-6 h-full text-gray-800">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample"
            />
          </div>
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={onSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Nom d'utilisateur"
                  ref={usernameRef}
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  ref={passwordRef}
                  placeholder="Mot de passe"
                  required
                  min={8}
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  ref={confirmPasswordRef}
                  placeholder="Confirmation mot de passe"
                  required
                  min={8}
                />
              </div>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  {loading ? 'Veuillez patienter...' : "S'enregistrer"}
                </button>
                <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                  Vous avez déjà un compte ?
                  <Link
                    to="/login"
                    className="text-sky-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register

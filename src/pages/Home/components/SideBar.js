import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import httpClient from '../../../utils/client'
import { useDispatch, useSelector } from 'react-redux'
import { setAvatar } from '../../../features/user/userSlice'

const SideBar = () => {
  const user = useSelector((state) => state.user.data)
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()
  const inputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState(
    user.avatar ||
      'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'
  )

  useEffect(() => {
    setUrl(
      user.avatar ||
        'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'
    )
  }, [user])

  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  const changeAvatar = async (event) => {
    if (event.target.files.length === 0) return
    const value = confirm('Voulez-vous vraiment changer votre profil ?')
    if (!value) {
      inputRef.current.value = ''
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('file', event.target.files[0])
    formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET)
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
      formData
    )
    const { url } = response.data
    setUrl(url)
    httpClient(token)
      .put('/users/avatar/', { url })
      .then(() => {
        dispatch(setAvatar(url))
        alert('Profil mise à jour !')
      })
      .catch((error) => {
        console.log(error)
        alert("Nous n'avons pas pu changer votre profil, veuillez réessayer !")
        setUrl(
          user.avatar ||
            'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'
        )
      })
      .finally(() => {
        inputRef.current.value = ''
        setLoading(false)
      })
  }

  return (
    <div className="bg-sky-500 h-full w-[10%] rounded-xl py-5 relative">
      <div className="relative">
        <img
          src={url}
          alt="Profile d'utilisateur"
          className="rounded-full w-[3.5rem] h-[3.5rem] mx-auto object-cover"
        />
        <div className="flex justify-center mt-4">
          {!loading && (
            <label
              htmlFor="avatar"
              className=""
              title="Changer l'image de profil">
              <img
                className="w-[40px] h-[40px]"
                src="data:image/png;base64,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"
              />
            </label>
          )}
          {loading && <p>...</p>}
          <input
            type="file"
            className="hidden"
            id="avatar"
            ref={inputRef}
            onChange={changeAvatar}
          />
        </div>
      </div>
      <div className="flex justify-end mt-10">
        <div className="bg-v bg-violet-700 py-2 border-r-4 border-yellow-400 w-[70%] pl-10 rounded-tl-lg rounded-bl-lg">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAABmJLR0QA/wD/AP+gvaeTAAACTElEQVRYhe2XT4hNURyAv8PIiDImK//mFcNIhLIhCxsLlLIcbCVNFko2FlayJktbVrMTIjUzCxYkyp9slExpEjVNMw3e+Czufbm9d+998+bei8V8dev1+53O+c7v3XPuObDIItUSinagLgNqQC9QBz4DEyGEuaJ9L0SmVx1SR9UZW5lV76tn1TV/Q2iFelmdSpHJ4pt6Ue2uSmqr+rIDoWZeqbWypfbEMy/KhLq3LKma+qUEqQbj6rqiUl3qkxKlGjxVlxQRO1OBVIPTeWNn7mNG+9MHYMOCZ5bPR6A/hPAzLZlXzsNUJwXQBxzKSuaJnSjfpYXjWYk8sX0ViDRzMCuRJ7YtJfYa2AlsBkYT8WfAQPw8T8RH4ra7gDcp/a3PGb8VtTtjJQ0m2hxIxI8k4kcT8f2J+MmU/n6py9Mcsipm/DTTl/hdKxBvMAekrsq87eIr0VEmyXfgJjANnAdWx/Fp4Ebc3xCwMo5PAteBVcA5oLk64yGEjVkOWWKjxffQtoxkjZ/38o91NJOFcS8rkfdXbgfeVqLzh4EQwvu0RGbFQgjvgMeVKcHdLKm2qLvVegXvVl3dUWha6tUKxK4UkorFlhqdn8piWG17O2t7WIuvYT2FZxhxGzgVQkjbvDtD7S+hSjNGN6XC99ik2IUCQrPqLbXjc13XPNocy8lNAcPAWqLvYgDGgU/AI+BBCGGqU6m2qD3qj4xqjKlbSh90nmKDKULT6iWL3HJKELvTJPVQ3fTPhBJiL2KhSaOrXHmrqghGp9Rr/0WVFmnDbwm6Df4M6hq+AAAAAElFTkSuQmCC"
            alt="Chat"
          />
        </div>
      </div>
      <div className="flex justify-center items-center w-full absolute bottom-3">
        <button onClick={logout}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAACfklEQVR4nO2au24TQRSGz0SJxSvkotQ8A6JBCImL08Er0EOBQ02Ui+FtaJNAAW9AQQE0jimgi92Y5qPYs2Jj7a7X3tk5EM5Xecba+f9zZjyaPR4Rx3Ecx6kE2APeAVPSMwXOgb5V8IcGQVdxkDr4PRWeAS+AraQGMg9bwEA9QMqVQLbsAQbJRKu97KuXs5SiExXd1PZDYNTtKr/CCHig2pvadxk7zlCTAEREQghB2yMR2YltYAGjEMJumZ/Oyaehqn1d9NdiD/iv4QmwNmCNJ8DagDWeAGsD1ngCrA1Y4wmwNmCNJ2DVB4EecAJ8B8bAMdCLaW6B/inwFXjclUDt25gGPM9RQv0i58DNWNpNDYy16xZwWz+PE+rPM9NJubGMTps9IF/ua/KnsLLRYrwrBKWqXeFnICKf0EpSKxrMwOuSWThpLbykvxreArutBWra62SbYM4xsN5g3I8NzMfiEnhW52uZmmBpTa6qf9G4iXkfQrhT9oWfAww0PyTUmojIcxG5t/ST+Y+oqr2ov2sa/P473wQ3gGFBcFi32cSmJvAvwP1oAjXtNyXiw9bCzfXnWekg1MbAT+0qngR/RBFvpl/kjBWPwm02wV+FMcJcXwpOReSbiDwJIdwNIXyOOnqDGTgqWYaHqfQ7p0ECepqEMXBBdpki2uvwX5+A66LvJ0FrA9Z4AqwNWOMJsDZgjSfA2oA1ngBrA9YsU8C4EJGdpOdxkVHXAnUrYCqSXVjW9tMUhgqMVFOAbe2LflW2ErL/2wD2k4lWe3mZFz5SivZVdEZ2W9viuvy2Bp9fl3+U2sBBSdHDildJgy8koU9Wc5ssMNgFE9VOO/OO4zjOf8JvkrXNHc8MJrEAAAAASUVORK5CYII="
            alt="Logout"
          />
        </button>
      </div>
    </div>
  )
}

export default SideBar

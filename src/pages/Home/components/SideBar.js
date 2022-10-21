const SideBar = () => {
  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="bg-sky-500 h-full w-[10%] rounded-xl py-5 relative">
      <div>
        <img
          src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
          alt="Profile d'utilisateur"
          className="rounded-full w-[50%] mx-auto object-cover"
        />
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

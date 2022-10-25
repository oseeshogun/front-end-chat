import SideBar from './components/SideBar'
import ContactList from './components/ContactList'
import { Outlet, useLocation } from 'react-router-dom'

const Home = () => {
  const location = useLocation()

  const isHome = location.pathname === '/'

  return (
    <div className="h-screen w-screen flex lg:px-10 lg:py-4 bg-slate-100 overflow-hidden justify-between relative">
      <SideBar />
      <ContactList className={isHome ? 'z-10' : ''} />
      <div className="w-[100%] absolute lg:static lg:w-[50%] h-full bg-white lg:rounded-2xl">
        <Outlet />
      </div>
    </div>
  )
}

export default Home

import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navbarClass, navContainerClass, navBrandClass, navLinksClass, navLinkClass, navLinkActiveClass, primaryBtn } from '../styles/common'
import { useAuth } from '../store/authStore'
import { toast } from 'react-hot-toast'

function Header() {
    const { currentUser, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        try {
            await logout()
            toast.success('Logged out successfully!')
            navigate('/login')
        } catch (err) {
            toast.error('Logout failed!')
        }
    }

    return (
        <div className={navbarClass}>
            <div className={navContainerClass}>
                <span className={navBrandClass}>
                    <img className='w-10 rounded-full inline-block mr-2 align-middle' src={logo} alt='Blog App' />
                    Blog App
                </span>
                <nav className='flex items-center gap-7'>
                    <ul className={navLinksClass}>
                        <li>
                            <NavLink to='/' className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>Home</NavLink>
                        </li>
                        {!isAuthenticated && (
                            <>
                                <li>
                                    <NavLink to='register' className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>Register</NavLink>
                                </li>
                                <li>
                                    <NavLink to='login' className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>Login</NavLink>
                                </li>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                <li>
                                    <NavLink to='userdashboard' className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>UserProfile</NavLink>
                                </li>
                                <li>
                                    <NavLink to='authordashboard' className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>AuthorProfile</NavLink>
                                </li>
                                <li>
                                    <NavLink to='admindashboard' className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>AdminProfile</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                    {isAuthenticated && (
                        <div className='flex items-center gap-3 border-l border-[#e8e8ed] pl-7 ml-0'>
                            {(currentUser?.profileImageUrl || currentUser?.profileImage) && (
                                <img
                                    className='rounded-full w-8 h-8 object-cover border border-[#d2d2d7]'
                                    src={currentUser?.profileImageUrl || currentUser?.profileImage}
                                    alt="user"
                                />
                            )}
                            <button className={primaryBtn} onClick={onLogout}>Logout</button>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    )
}

export default Header

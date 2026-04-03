import { useAuth } from '../store/authStore'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles }) {
    //get the login status from store
    const loading = useAuth(state => state.loading)
    const currentUser = useAuth(state => state.currentUser)
    const isAuthenticated = useAuth(state => state.isAuthenticated)

    //loading state
    if (loading) {
        return <p>Loading...</p>
    }
    //if the user is not loggedIn
    if (!isAuthenticated) {
        //redirect to the login page
        return <Navigate to="/login" replace />
    }
    //check roles
    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
        //redirect to unauthorized page
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute
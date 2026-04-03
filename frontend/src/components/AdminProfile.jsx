import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { cardClass, pageTitleClass, bodyText } from '../styles/common'
import UsersList from './UsersList'
import AuthorsList from './AuthorsList'

function AdminProfile() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:4000/admin-api/users', { withCredentials: true })
      setUsers(res.data.payload || [])
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleBlock = async (user) => {
    const isBlocking = user.isActive
    const endpoint = isBlocking ? '/admin-api/block' : '/admin-api/unblock'
    
    // Optimistic UI update
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !isBlocking } : u))
    
    try {
      const res = await axios.put(`http://localhost:4000${endpoint}`, { userEmail: user.email }, { withCredentials: true })
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update status')
      // Revert optimistic update
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: isBlocking } : u))
    }
  }

  const justUsers = users.filter(u => u.role === 'USER')
  const justAuthors = users.filter(u => u.role === 'AUTHOR')

  return (
    <div className='max-w-6xl mx-auto'>
      <div className={cardClass + ' text-center mb-8'}>
        <h2 className={pageTitleClass}>Admin Profile</h2>
        <p className={bodyText}>Welcome to your admin dashboard.</p>
        
        <div className="flex justify-center gap-4 mt-8">
          <button 
            className={`px-8 py-2.5 rounded-full font-semibold transition-colors ${activeTab === 'users' ? 'bg-[#0066cc] text-white' : 'bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d2d2d7]'}`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users ({justUsers.length})
          </button>
          <button 
            className={`px-8 py-2.5 rounded-full font-semibold transition-colors ${activeTab === 'authors' ? 'bg-[#0066cc] text-white' : 'bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d2d2d7]'}`}
            onClick={() => setActiveTab('authors')}
          >
            Manage Authors ({justAuthors.length})
          </button>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-center py-10 text-slate-500 animate-pulse">Loading accounts...</p>
        ) : (
          activeTab === 'users' ? (
            <UsersList users={justUsers} onToggleBlock={handleToggleBlock} />
          ) : (
            <AuthorsList authors={justAuthors} onToggleBlock={handleToggleBlock} />
          )
        )}
      </div>
    </div>
  )
}

export default AdminProfile
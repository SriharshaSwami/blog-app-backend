import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { useState } from 'react'
import { errorClass, formCard, formTitle, inputClass, submitBtn, formGroup } from '../styles/common'
import { toast } from 'react-hot-toast'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // funciton from store
  const login = useAuth(state => state.login)
  const currentUser = useAuth(state => state.currentUser)
  const isAuthenticated = useAuth(state => state.isAuthenticated)
  const error = useAuth(state => state.error)

  const onLogin = async (userLoginObj) => {
    console.log('login user:', userLoginObj)
    await login(userLoginObj)
    setTimeout(() => {
      const auth = useAuth.getState()
      if (auth.isAuthenticated && auth.currentUser) {
        toast.success('Login successful!')
      } else if (auth.error) {
        toast.error(auth.error.response?.data?.error || auth.error.message || 'Login failed')
      }
    }, 1 * 100)
  }

  // Redirect after successful login or if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role) {
      if (currentUser.role === "USER") {
        navigate('/userdashboard')
      } else if (currentUser.role === "AUTHOR") {
        navigate('/authordashboard')
      } else if (currentUser.role === "ADMIN") {
        navigate('/admindashboard')
      }
    }
  }, [isAuthenticated, currentUser, navigate])

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className={formCard + " shadow-sm border border-[#e8e8ed]"}>
        <h2 className={formTitle}>Welcome back</h2>

        {/* Display error from authStore */}
        {error && (
          <p className={errorClass + ' mb-6'}>
            {error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed'}
          </p>
        )}

        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <div className={formGroup}>
            <label className={labelClass}>EMAIL ADDRESS</label>
            <input
              className={inputClass}
              type='email'
              placeholder='name@example.com'
              {...register('email', {
                required: 'Email required',
                pattern: { value: emailRegex, message: 'Invalid email format' },
              })}
            />
            {errors.email?.message && <p className={errorClass + ' mt-2 animate-in fade-in'}>{errors.email.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>PASSWORD</label>
            <input
              className={inputClass}
              type='password'
              placeholder='Enter password'
              {...register('password', { required: 'password required' })}
            />
            {errors.password?.message && <p className={errorClass + ' mt-2 animate-in fade-in'}>{errors.password.message}</p>}
          </div>

          <button className={submitBtn + " py-3 mt-4"} type='submit'>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

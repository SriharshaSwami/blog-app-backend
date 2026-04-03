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
    <div className={formCard}>
      <h2 className={formTitle}>Login</h2>

      {/* Display error from authStore */}
      {error && (
        <p className={errorClass + ' mb-4'}>
          {error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed'}
        </p>
      )}

      <form onSubmit={handleSubmit(onLogin)}>
        <div className={formGroup}>
          <input
            className={inputClass}
            type='email'
            placeholder='Email'
            {...register('email', {
              required: 'Email required',
              pattern: { value: emailRegex, message: 'Invalid email format' },
            })}
          />
          {errors.email?.message && <p className={errorClass + ' mt-1'}>{errors.email.message}</p>}
        </div>

        <div className={formGroup}>
          <input
            className={inputClass}
            type='password'
            placeholder='Password'
            {...register('password', { required: 'password required' })}
          />
          {errors.password?.message && <p className={errorClass + ' mt-1'}>{errors.password.message}</p>}
        </div>

        <button className={submitBtn} type='submit'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login

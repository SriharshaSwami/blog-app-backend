import React from 'react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {loadingClass, errorClass} from '../styles/common.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      role: 'USER',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profileImageUrl: '',
    },
  })

  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  const onRegister = async (newUser) => {
    //console.log('register user:', newUser)
    // Create form data object
    const formData = new FormData();
    //get user object
    let { role, profileImageUrl, ...userObj } = newUser;
    //add all fields except profilePic to FormData object
    Object.keys(userObj).forEach((key) => {
    formData.append(key, userObj[key]);
    });
    // add profilePic to Formdata object
    if (profileImageUrl && profileImageUrl[0]) {
      formData.append("profilePic", profileImageUrl[0]);
    }

    try{
      setLoading(true)
      //make API req
      if(newUser.role === "USER"){
        //make req to user api
        let res = await axios.post("http://localhost:4000/user-api/users", formData, {withCredentials: true})
        console.log("res obj is ", res)
        if(res.status === 201){
          //navigate to login
          navigate('/login')
        }
      }

      if(newUser.role === "AUTHOR"){
        //make req to author api
        let res = await axios.post("http://localhost:4000/author-api/users", formData, {withCredentials: true})
        console.log("res obj is ", res)
        if(res.status === 201){
          //navigate to login
          navigate('/login')
        }
      }

    }catch(err){
      console.log("err is ", err.message)
      setError(err.response?.data?.error || "Registration Failed")
    }
    finally{
      setLoading(false)
    }
  }


  //cleanup, remove preview image from browser memory
  useEffect(() => {
    return () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
    };
  }, [preview]);

  //if loading
  if(loading){
    return <p className={loadingClass}>Loading...</p>
  }
  

  return (
    <div className='bg-slate-200 p-4 sm:p-8 rounded-md'>
      <h2 className='text-3xl text-center mb-6'>Create an Account</h2>

      <form className='w-full max-w-xl mx-auto' onSubmit={handleSubmit(onRegister)}>
        {/* diplay err message  */}
        {error && <p className={errorClass}>{error}</p>}
        <div className='flex flex-wrap items-center justify-center gap-4 mb-5'>
          <p className='text-2xl'>Select Role</p>

          <label className='flex items-center gap-2 text-2xl'>
            <input type='radio' value='USER' {...register('role', { required: '{Value} is and Invalid role' })} />
            User
          </label>

          <label className='flex items-center gap-2 text-2xl'>
            <input type='radio' value='AUTHOR' {...register('role', { required: '{Value} is and Invalid role' })} />
            Author
          </label>
        </div>
        {errors.role?.message && <p className='text-red-600 text-sm mb-3 text-center'>{errors.role.message}</p>}

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
          <div>
            <input
              className='w-full p-3 border border-slate-400 bg-slate-300'
              type='text'
              placeholder='First name'
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName?.message && <p className='text-red-600 text-sm mt-1'>{errors.firstName.message}</p>}
          </div>

          <div>
            <input
              className='w-full p-3 border border-slate-400 bg-slate-300'
              type='text'
              placeholder='Last name'
              {...register('lastName')}
            />
          </div>
        </div>

        <div className='mb-4'>
          <input
            className='w-full p-3 border border-slate-400 bg-slate-300'
            type='email'
            placeholder='Email'
            {...register('email', {
              required: 'Email required',
              pattern: { value: emailRegex, message: 'Invalid email format' },
            })}
          />
          {errors.email?.message && <p className='text-red-600 text-sm mt-1'>{errors.email.message}</p>}
        </div>

        <div className='mb-4'>
          <input
            className='w-full p-3 border border-slate-400 bg-slate-300'
            type='password'
            placeholder='Password'
            {...register('password', {
              required: 'password required',
            })}
          />
          {errors.password?.message && <p className='text-red-600 text-sm mt-1'>{errors.password.message}</p>}
        </div>

        <div className='mb-4'>
          <input className='border bg-gray-200'
        type="file"
        accept="image/png, image/jpeg"
        {...register("profileImageUrl")}
        onChange={(e) => {

            //get image file
            const file = e.target.files[0];
            // validation for image format
            if (file) {
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                setError("Only JPG or PNG allowed");
                return;
                }
                //validation for file size
                if (file.size > 2 * 1024 * 1024) {
                setError("File size must be less than 2MB");
                return;
                }
                //Converts file → temporary browser URL(create preview URL)
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setError(null);
            }
        }} />
        {preview && (
                <div className="mt-3 flex justify-center">
                <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border"
                />
                </div>
            )}
        </div>

        <div className='text-center'>
          <button className='bg-sky-400 hover:bg-sky-500 px-8 py-3 text-3xl font-semibold' type='submit'>
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register

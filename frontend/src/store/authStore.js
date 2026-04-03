import { create } from 'zustand'
import axios from 'axios'

export let useAuth = create((set) => ({
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    login: async (userCredObjWithRole) => {
        //seperate role form obj
        const {role, ...userCredObj} = userCredObjWithRole
        try{
            //set loading 
            set({ loading: true, error: null})

            //make api req
            let res = await axios.post("http://localhost:4000/common-api/login", userCredObj, {withCredentials: true})
            console.log("res is ", res)
            //update state
            set({
                loading: false,
                isAuthenticated: true,
                currentUser: res.data.payload
            })

        }catch(err){
            //set error
            console.log("Error is ", err)
            set({
                loading: false,
                error: err,
                isAuthenticated: false,
                currentUser: null
            })
        }
    },
    logout: async () => {
        try{
            //set loading true
            set({ loading: true, error: null })
            //make api req
            await axios.get('http://localhost:4000/common-api/logout', { withCredentials: true})
            //update state
            set({ loading: false, currentUser: null, isAuthenticated: false})
        }catch(err){
            //set error
            console.log("Error is ", err)
            set({
                loading: false,
                error: err,
                isAuthenticated: false,
                currentUser: null
            })
        }
    },
    checkAuth: async () => {
        try{
            //set loading
            set({loading: true, error: null})
            console.log("Starting checkAuth call...")
            const res = await axios.get('http://localhost:4000/common-api/check-auth', {withCredentials: true})
            console.log("checkAuth success:", res.data)
            //update the store states
            set({
                loading: false,
                currentUser: res.data.payload,
                isAuthenticated: true
            })
            
        }catch(err){
            //set error
            console.error("checkAuth failed:", err.response?.data || err.message)
            set({
                loading: false,
                error: err,
                isAuthenticated: false,
                currentUser: null
            })
        }
    }
}))
import axios from 'axios'

const API = axios.create({
    baseURL:'http://localhost:5173/api',
    headers:{
        'Content-Type':'application/json'
    }
})

API.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return token
})

export default API
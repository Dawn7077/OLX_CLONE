import {createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

const API_URL = 'http://localhost:3000/api/auth/'

export interface UserData {
    _id:string,
    email:string,
    token:string
}

interface AuthState{
    user:UserData |null
    isLoading:boolean
    isError:boolean
    message:string
}

const storedUser = localStorage.getItem('user')
const user : UserData | null = storedUser? JSON.parse(storedUser):null

const initialState: AuthState={
    user:user,
    isLoading:false,
    isError:false,
    message:''
}
interface LoginFormInput{
    email:string
    password:string
}
interface RegisterFormInput{
    email:string
    password:string
}

export const login = createAsyncThunk<
    UserData,               //1. Fulfilled return type
    // Record<string,string>,      // Argument type passed to the thunk (e.g. { email, password })
    LoginFormInput,               
    {rejectValue:string}        // Error config typee
>('auth/login',async(userData,thunkAPI)=>{
    try {
        const response  = await fetch(`${API_URL}login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(userData),
        })

        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message || 'login failed')
        }

        localStorage.setItem('user',JSON.stringify(data))
        return data
    } catch (error:unknown) {
        const err = error instanceof Error? error.message :'Something went wrong'
        return thunkAPI.rejectWithValue(err)
    }
})

export const registerUser = createAsyncThunk<
UserData,RegisterFormInput,{rejectValue:string}>
('auth/register',async(userData,thunkAPI)=>{
    try {
        const response = await fetch('http://localhost:3000/api/auth/register',{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(userData)
        })
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message || 'Registration failed')
        }

        localStorage.setItem('user',JSON.stringify(data))
        return data
    } catch (error:unknown) {
        const err = error instanceof Error? error.message :'Something went wrong'
        return thunkAPI.rejectWithValue(err)
    }
})

export const authSlice  = createSlice({
    name:'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            localStorage.removeItem('user')
            state.user = null
        },
        clearAuthError:(state)=>{
            state.isError =false
            state.message=''
        }
    },
    extraReducers:(builder)=>{
        builder.
            addCase(login.pending,(state)=>{
                state.isLoading = true
            })
            .addCase(login.fulfilled,(state,action:PayloadAction<UserData>)=>{
                state.isLoading=false
                state.user = action.payload
            })
            .addCase(login.rejected,(state,action)=>{
                state.isError=true
                state.isLoading=false
                state.message = action.payload || 'Something went wrong'
                state.user = null
            })
            .addCase(registerUser.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(registerUser.fulfilled,(state,action:PayloadAction<UserData>)=>{
                state.isLoading=false
                state.user = action.payload
            })
            .addCase(registerUser.rejected,(state,action )=>{
                state.isLoading=false
                state.isError = true;
                state.message = action.payload || 'Something went wrong'
            })
    }
})

export const {logout, clearAuthError} = authSlice.actions
export default authSlice.reducer
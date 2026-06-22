import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./productSlice";
import type { RootState } from "../app/store";

export interface CartItem{
    product:Product,
    quantity:number
}

interface CartState{
    cartItems:CartItem[]
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
}

const initialState:CartState={
    cartItems:[],
    isLoading:false,
    isError:false,
    isSuccess:false,
    message:''
}

export const checkoutCart = createAsyncThunk<
    { message: string; modifiedCount: number }, //Unexpected any. Specify a different type.
    {productIds:string[]},
    {rejectValue:string; state:RootState}
    >('cart/checkout', async(productIds,thunkAPI)=>{
    try {
        const state = thunkAPI.getState()
        const token = state.auth.user?.token
        if(!token){
            throw new Error('You must be logged in to complete checkout.')
         }

        const res = await fetch('http://localhost:3000/api/products/checkout',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(productIds)
        })
        const data = await res.json()
        if(!res.ok){
            throw new Error(data.message || 'Checkout failed');
        }

        return data
    } catch (error:unknown) {
        const err = error instanceof Error? error.message : 'Something went wrong'
        return thunkAPI.rejectWithValue(err)
    }
})

export const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart:(state,action:PayloadAction<Product>)=>{
            state.isSuccess = false;
            const incomingProducts = action.payload
            
            const existingItem = state.cartItems.find(item=>item.product._id === incomingProducts._id)
            
            if(existingItem){
                existingItem.quantity +=1
            }else{
                state.cartItems.push({product:incomingProducts,quantity:1})
            }
        },
        removeFromCart:(state,action:PayloadAction<string>)=>{
            state.cartItems = state.cartItems.filter(item=> item.product._id !== action.payload)
        },
        updateQuantity:(state,action:PayloadAction<{id:string;qty:number}>)=>{
            const item =state.cartItems.find(item=>item.product._id === action.payload.id)
            if(item && action.payload.qty > 0){
                item.quantity = action.payload.qty
            }
        },
        resetCart:(state)=>{
            state.isSuccess=false
            state.isError=false
            state.message=''
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(checkoutCart.pending,(state)=>{
            state.isLoading= true
        })
        .addCase(checkoutCart.fulfilled,(state)=>{
            state.isSuccess= true
            state.isLoading= false
            state.cartItems =[] //clear the cart after order purchase
        })
        .addCase(checkoutCart.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload || 'Failed to complete transaction'
        })
    }
})

export const {addToCart,removeFromCart,updateQuantity,resetCart} = cartSlice.actions
export default cartSlice.reducer

import type { RootState } from '../app/store'
import {createSlice,createAsyncThunk,type PayloadAction} from '@reduxjs/toolkit'
const API_URL = 'http://localhost:3000/api/products'
export interface Product{
    _id:string
    title:string
    description:string
    price:string
    imageUrl:string
    seller:{
        _id:string
        email:string
    }
    isSold:boolean
    createdAt:string
}

interface ProductState{
    items:Product[]
    isLoading:boolean
    isError:boolean
    message:string
}

export interface CreateProductInput {
    title: string
    description: string
    price: string
    imageUrl: string
}

const initialState: ProductState ={
    items:[],
    isLoading:false,
    isError:false,
    message:''
}

export const fetchProducts = createAsyncThunk<Product[],void,{rejectValue:string}>(
    'products/fetchAll',
    async (_,thunkAPI) => {
        try {
            const response = await fetch(API_URL)
            const data = await response.json()

            if(!response.ok){
                throw new Error(data.message || 'Failed to fetch products')
            }
            return data
        } catch (error:unknown) { //Unexpected any. Specify a different type.
            const err  = error instanceof Error ? error.message :'Something went wrong'
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const createProduct = createAsyncThunk<
Product,
// CreateProductInput,
FormData,
{rejectValue:string; state:RootState}
>('products/create',
    async(formData,thunkAPI)=>{
        try {
            const state = thunkAPI.getState()
            const token = state.auth.user?.token
            if(!token){
                throw new Error('you must be logged in to sell items')
            }

            const response = await fetch('http://localhost:3000/api/products',{
                method:"POST",
                headers:{
                    // 'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                // body:JSON.stringify(productData)
                body: formData 
            })

            const data = await response.json()
            if(!response.ok){
                throw new Error(data.message || 'Failed to add product');
            }

            return data
        } catch (error:unknown) {
            const err  = error instanceof Error ? error.message :'Something went wrong'
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const fetchMyProducts = createAsyncThunk<Product[],void,{rejectValue:string;state:RootState}>(
    'products/fetchMyAds',
    async(_,thunkAPI)=>{
        try {
            const token = thunkAPI.getState().auth.user?.token
            if(!token)throw new Error('Authentication required')
            
                const res = await fetch('http://localhost:3000/api/products/my-ads',{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                })
                const data = await res.json()
                if(!res.ok) throw new Error(data.message || 'Failed to fetch your ads');
                return data
        } catch (error:unknown) {
            const err = error instanceof Error ? error.message : " something is wrong fetchMyProducts"
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const deleteProductThunk = createAsyncThunk<string,string,{rejectValue:string}>(
    'products/delete',
    async(productId,thunkAPI)=>{
        try {
            const token = thunkAPI.getState().auth.user?.token // Object is of type 'unknown'. (property) getState: () => unknown

            if(!token)throw new Error('Authentication required')
            
            const res = await fetch(`http://localhost:3000/api/products/${productId}`,{
                method:'DELETE',
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to delete your ad');

            return productId

        } catch (error:unknown) {
            const err = error instanceof Error? error.message : 'Something is wrong deleteThunk'
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const productSlice = createSlice({
    name:'products',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.
        addCase(fetchProducts.pending, (state)=>{
            state.isLoading= true
            state.isError= false
        }).
        addCase(fetchProducts.fulfilled,(state,action:PayloadAction<Product[]>)=>{
            state.isLoading= false
            state.items= action.payload 
        }).
        addCase(fetchProducts.rejected,(state,action)=>{
            state.isLoading= false
            state.isError= true
            state.message= action.payload || 'Failed to load listings' 
        })
        .addCase(createProduct.pending,(state)=>{
            state.isLoading= true
        })
        .addCase(createProduct.fulfilled,(state,action)=>{
            state.isLoading= false
            state.items.unshift(action.payload)
            
        })
        .addCase(createProduct.rejected,(state,action)=>{
            state.isLoading= false
            state.isError= true
            state.message = action.payload || 'Failed to create product';
        })
        .addCase(fetchMyProducts.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(fetchMyProducts.fulfilled,(state,action:PayloadAction<Product[]>)=>{
            state.isLoading = false 
            state.items = action.payload
        })
        .addCase(fetchMyProducts.rejected,(state,action)=>{
            state.isLoading= false
            state.isError= true
            state.message  = action.payload ||'Failed to sync your ads';
        })
        .addCase(deleteProductThunk.pending,(state )=>{
            state.isLoading= true
        })
        .addCase(deleteProductThunk.fulfilled,(state,action:PayloadAction<string>)=>{
            state.isLoading= false
            state.items=  state.items.filter(item=> item._id !== action.payload)
        })
        .addCase(deleteProductThunk.rejected,(state,action)=>{
            state.isLoading= false
            state.isError =true
            state.message = action.payload || 'Failed to complete listing deletion';
        })
    }

})


export default productSlice.reducer
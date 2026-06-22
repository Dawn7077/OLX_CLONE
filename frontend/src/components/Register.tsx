import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"
import { useNavigate ,Link} from "react-router-dom" 
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { clearAuthError, registerUser } from "../features/authSlice"

interface RegisterFormInput{
    email:string
    password:string
}

export default function Register(){
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const {user,isLoading,isError,message} = useSelector((state:RootState)=>state.auth)
    const{
        register,handleSubmit,formState:{errors}
    }= useForm<RegisterFormInput>()

    useEffect(()=>{
        if(user){
            navigate('/')
        }
        return ()=>{
            dispatch(clearAuthError())
        }
    },[user,navigate,dispatch])

    const onSubmit = (data:RegisterFormInput)=>{
        dispatch(registerUser(data))
    }


    return(
        <div style={styles.pageBackground}>
            <div style={styles.cardContainer}>
                <h2 style={styles.heading}>Create an Account</h2> 
                {isError && <p style={styles.errorAlert}>{message}</p>}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={styles.label}>Email Address</label>
                        <input type="text"
                        style={{ ...styles.inputField, border: errors.email ? '1px solid #ff4d4f' : '1px solid #002f34' }}
                        {...register('email',{
                            required:"Email is required",
                            pattern:{
                                value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email format',
                            }
                        })} />
                        {errors.email && <span style={styles.errorMessage}>{errors.email.message}</span>}
                    </div>
                    
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={styles.label}>Password</label>
                        <input type="password"
                         style={{ ...styles.inputField, border: errors.password ? '1px solid #ff4d4f' : '1px solid #002f34' }}
                         {...register('password',{
                            required: 'Password is required',
                            minLength:{
                                value:6,
                                message:"Password must be at least 6 characters long"
                            }
                         })}
                         />
                         {errors.password && <span style={styles.errorMessage}>{errors.password.message}</span>}
                    </div>
                    
                     <button type="submit" disabled={isLoading} style={{ ...styles.submitBtn, opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                     </button> 
                </form>

                <p style={styles.footerText}>
                    Already have an account? <Link to='/login' style={styles.redirectLink}>Login here</Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    pageBackground: {
        backgroundColor: '#f2f4f5',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Roboto, Arial, sans-serif',
        boxSizing: 'border-box' as const
    },
    cardContainer: {
        width: '100%',
        maxWidth: '430px',
        margin: '2rem auto',
        padding: '2.5rem 2rem',
        backgroundColor: '#fff',
        border: '1px solid #e3e7eb',
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
    },
    heading: {
        color: '#002f34',
        fontSize: '1.75rem',
        fontWeight: 700,
        margin: '0 0 1.5rem 0',
        textAlign: 'center' as const
    },
    errorAlert: {
        color: '#ff4d4f',
        backgroundColor: '#fff1f0',
        padding: '0.75rem 1rem',
        borderRadius: '4px',
        border: '1px solid #ffccc7',
        fontSize: '0.9rem',
        fontWeight: 500,
        margin: '0 0 1.5rem 0'
    },
    label: {
        display: 'block',
        fontWeight: 600,
        marginBottom: '0.4rem',
        color: '#002f34',
        fontSize: '0.9rem'
    },
    inputField: {
        width: '100%',
        backgroundColor: '#eeeeee',
        padding: '0.75rem',
        boxSizing: 'border-box' as const,
        borderRadius: '4px',
        outline: 'none',
        fontSize: '1rem',
        color: '#002f34',
        transition: 'all 0.2s ease-in-out'
    },
    errorMessage: {
        color: '#ff4d4f',
        fontSize: '0.8rem',
        marginTop: '0.35rem',
        display: 'block',
        fontWeight: 500
    },
    submitBtn: {
        width: '100%',
        padding: '0.85rem',
        backgroundColor: '#002f34',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold' as const,
        fontSize: '1rem',
        transition: 'background-color 0.2s'
    },
    footerText: {
        marginTop: '1.5rem',
        textAlign: 'center' as const,
        fontSize: '0.92rem',
        color: '#4a4a4a'
    },
    redirectLink: {
        color: '#002f34',
        fontWeight: 'bold',
        marginLeft: '0.25rem',
        textDecoration: 'underline'
    }
};
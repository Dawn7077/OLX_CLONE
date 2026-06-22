import { useDispatch, useSelector } from "react-redux"
import { useNavigate,Link } from "react-router-dom"
import type {RootState,AppDispatch} from '../app/store'
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { clearAuthError ,login} from "../features/authSlice"
 
interface LoginFormInput{
    email:string
    password:string
}

export default function Login(){
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const {user,isError,isLoading,message} =useSelector((state:RootState)=>state.auth)

    const {register,handleSubmit,formState:{errors}}= useForm<LoginFormInput>()

    useEffect(()=>{
        if(user){
            navigate('/')
        }
        return ()=>{
            dispatch(clearAuthError())
        }
    },[user,navigate,dispatch])

    const onSubmit = (data:LoginFormInput)=>{
        dispatch( login (data))
    }

    return(
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={styles.heading}>Login</h2>
                    <Link to="/" style={styles.homeLink}>
                        ← Home
                    </Link>
                </div>
                {isError && <div style={styles.errorBanner}>{message}</div>}

                <form onSubmit={handleSubmit(onSubmit)} >
                    <div style={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            style={styles.input}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Please enter a valid email address',
                                },
                            })}
                        />
                        {errors.email && <span style={styles.fieldError}>{errors.email.message}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password"
                            placeholder="Enter your password"
                            style={styles.input}
                            {...register('password',{
                                required:'Password is requried',
                                minLength:{
                                    value:6,
                                    message:'Password must be atleast 6 characters'
                                }
                            })}
                        />
                        {errors.password && <span style={styles.fieldError}>{errors.password.message}</span>}
                    </div>

                    <button type="submit" disabled={isLoading} style={styles.button}>
                        {isLoading?'Logging in...':'Login'}
                         </button>
                </form>
            </div>
        </div>
    )
}

const styles = {
    heading: {
        color: '#002f34',
        margin: 0,
        fontSize: '1.75rem',
        fontWeight: 'bold' as const
    },
    homeLink: {
        color: '#002f34',
        fontSize: '0.9rem',
        fontWeight: 'bold' as const,
        textDecoration: 'none'
    },
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif' },
  card: { background: '#d2d0d0', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  inputGroup: { marginBottom: '1.25rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' as const, fontSize: '0.9rem', color: '#252424' },
  input: {backgroundColor: '#f2f1f1', color:'#4e4e4e', width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' as const, fontSize: '1rem' },
  button: { width: '100%', padding: '0.75rem', backgroundColor: '#002f34', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold' as const, cursor: 'pointer', marginTop: '0.5rem' },
  fieldError: { color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' },
  errorBanner: { backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' as const }
};
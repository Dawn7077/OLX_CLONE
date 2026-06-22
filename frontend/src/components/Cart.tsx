import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useNavigate,Link } from "react-router-dom";
import { checkoutCart, removeFromCart, updateQuantity ,resetCart} from "../features/cartSlice";
import { fetchProducts } from "../features/productSlice";
import { useEffect } from "react";


export default function Cart(){
    const dispatch =useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const {cartItems,isError,isLoading,isSuccess,message} = useSelector((state:RootState)=>state.cart)

    useEffect(()=>{ 
        return ()=>dispatch(resetCart()) // why call dispatch 2 times
    },[dispatch])
    

    const totalPrice = cartItems.reduce((res,item)=> res + (item.product.price * item.quantity),0)

    const handleCheckout = async()=>{
        const productIds =cartItems.map(it=> it.product._id)
        const result = await dispatch(checkoutCart({productIds}))

        if(checkoutCart.fulfilled.match(result)){
            dispatch(fetchProducts())
        }
    }

    if(isSuccess){
        return(
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={{ ...styles.heading, color: '#2bb673' }}>🎉 Checkout Successful!</h2>
                    <p style={styles.emptyText}>Your products have been marked as successfully sold.</p>
                    <button 
                        onClick={() => { 
                            dispatch(resetCart());
                            navigate('/'); 
                        }} 
                        style={styles.button}
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        )
    }

    return(
        <div style={styles.container}>
            <div style={styles.cartWrapper}>
                <div style={styles.headerRow}>
                    <h2 style={styles.mainTitle}>Your Cart</h2>
                    <Link to="/" style={styles.backLink}>
                        ← Back to Marketplace
                    </Link>
                </div>

                {isError && <div style={styles.errorBanner}>{message}</div>}

                {cartItems.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <p style={styles.emptyText}>Your cart is empty. Go back to the marketplace to find items.</p>
                        <Link to="/" style={{ ...styles.button, display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.product._id} style={styles.cartItem}>
                                <div style={styles.itemDetails}>
                                    <img 
                                        src={item.product.imageUrl} 
                                        alt={item.product.title} 
                                        style={styles.productImage}
                                    />
                                
                                    <div>
                                        <h4 style={styles.productTitle}>{item.product.title}</h4>
                                        <p style={styles.productPrice}>₹ {item.product.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.product._id))}
                                        style={styles.removeBtn}
                                    >
                                        Remove
                                    </button>
                                </div> 
                            </div> 
                        ))}

                        <div style={styles.summarySection}>
                            <h3 style={styles.totalText}>
                                Total Amount: <span style={{ color: '#002f34' }}>₹ {totalPrice.toLocaleString('en-IN')}</span>
                            </h3>
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                style={{ ...styles.button, maxWidth: '180px', opacity: isLoading ? 0.7 : 1 }}
                            >
                                {isLoading ? 'Processing Order...' : 'Confirm Checkout'}
                            </button>
                        </div>
                    </div>
                )} 
            </div>
        </div>
    )
}

const styles = {
    container: { 
        backgroundColor: '#f2f4f5', 
        minHeight: '100vh', 
        width: '100%', 
        fontFamily: 'Roboto, Arial, sans-serif',
        boxSizing: 'border-box' as const,
        padding: '2rem 1rem'
    },
    cartWrapper: {
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        boxSizing: 'border-box' as const
    },
    card: { 
        backgroundColor: '#fff', 
        padding: '2.5rem 2rem', 
        border: '1px solid #e3e7eb',
        borderRadius: '4px', 
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '480px',
        margin: '4rem auto',
        boxSizing: 'border-box' as const,
        textAlign: 'center' as const
    },
    headerRow: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        borderBottom: '2px solid #002f34',
        paddingBottom: '1rem'
    },
    mainTitle: {
        margin: 0,
        color: '#002f34',
        fontSize: '1.75rem',
        fontWeight: 700
    },
    heading: {
        margin: '0 0 1rem 0',
        fontSize: '1.5rem',
        fontWeight: 700
    },
    backLink: { 
        color: '#002f34', 
        fontWeight: 'bold', 
        textDecoration: 'none',
        fontSize: '0.95rem'
    },
    cartItem: { 
        display: 'flex', 
        backgroundColor: '#fff',
        border: '1px solid #e3e7eb',
        borderRadius: '4px',
        padding: '1rem', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    itemDetails: { 
        display: 'flex', 
        gap: '1.25rem', 
        alignItems: 'center' 
    },
    productImage: { 
        width: '90px', 
        height: '70px', 
        objectFit: 'cover' as const,
        borderRadius: '4px',
        border: '1px solid #e3e7eb'
    },
    productTitle: { 
        margin: '0 0 0.35rem 0',
        color: '#002f34',
        fontSize: '1.1rem',
        fontWeight: 600
    },
    productPrice: { 
        margin: 0, 
        color: '#4a4a4a',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    removeBtn: { 
        backgroundColor: 'transparent', 
        color: '#ff4d4f', 
        border: 'none', 
        padding: '0.5rem 1rem', 
        cursor: 'pointer', 
        fontWeight: 600,
        fontSize: '0.9rem',
        textDecoration: 'underline'
    },
    summarySection: { 
        marginTop: '2rem', 
        backgroundColor: '#fff',
        border: '1px solid #e3e7eb',
        borderRadius: '4px',
        padding: '1.5rem',
        textAlign: 'right' as const 
    },
    totalText: {
        margin: '0 0 1rem 0',
        fontSize: '1.35rem',
        fontWeight: 700,
        color: '#4a4a4a'
    },
    button: { 
        width: '70%', 
        padding: '0.85rem 2rem', 
        backgroundColor: '#002f34', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        fontSize: '1rem', 
        fontWeight: 'bold' as const, 
        cursor: 'pointer', 
        transition: 'background-color 0.2s'
    },
    emptyContainer: {
        backgroundColor: '#fff',
        border: '1px solid #e3e7eb',
        borderRadius: '4px',
        padding: '3rem 2rem',
        textAlign: 'center' as const,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    },
    emptyText: {
        color: '#4a4a4a',
        fontSize: '1.05rem',
        marginBottom: '1.5rem',
        lineHeight: '1.5'
    },
    errorBanner: { 
        color: '#ff4d4f',
        backgroundColor: '#fff1f0', 
        padding: '0.75rem 1rem', 
        borderRadius: '4px', 
        border: '1px solid #ffccc7',
        marginBottom: '1.5rem', 
        fontSize: '0.9rem', 
        fontWeight: 500
    }
};
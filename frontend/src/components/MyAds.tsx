import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useEffect } from "react";
import { deleteProductThunk, fetchMyProducts } from "../features/productSlice";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function MyAds(){
    const dispatch = useDispatch<AppDispatch>()
    const {items,isLoading,isError,message} = useSelector((state:RootState)=>state.products)
    const {user} = useSelector((state:RootState)=>state.auth)

    useEffect(()=>{
        if(user){
            dispatch(fetchMyProducts())
        }
    },[dispatch,user])

    function handleDelete(id:string,title:string){
        if(window.confirm(`Are you sure you want to permanently delete your ad listing for "${title}"?`)){
            dispatch(deleteProductThunk(id))
        }
    }

    if(!user) return <div style={styles.centeredMessage}>Please log in to view your posted ads.
    <Link to="/" style={{ color: '#002f34', fontWeight: 'bold' }}>Back to Home</Link>
    </div>;
    if(isLoading) return <div style={styles.centeredMessage}>Loading your advertisements...</div>;
    if(isError)return <div style={{ ...styles.centeredMessage, color: '#dc3545' }}>Error: {message}</div>;

    return(
        <div style={styles.pageWrapper}>

            <Navbar/>
        
            <div style={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ ...styles.heading, margin: 0 }}>My Posted Advertisements</h2>
                    <Link to="/" style={{ color: '#93abda', fontWeight: 'bold', textDecoration: 'none' ,marginLeft:'10px'}}>
                        ← Home
                    </Link>
                </div>
                {items.length ===0?
                (
                    <div style={{ padding: '2rem 0' }}>
                        <p>You haven't posted any products yet. Click on "+ SELL" to get started!</p>
                        <Link to="/" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#002f34', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                            Browse Marketplace
                        </Link>
                    </div>
                ):(
                    <div style={styles.grid}>
                        {items.map((product)=>(
                            <div key={product._id} style={{ ...styles.card, opacity: product.isSold ? 0.75 : 1 }}>
                                <div style={styles.imageWrapper}>
                                    <img src={product.imageUrl} alt={product.title} 
                                        style={styles.image}
                                        onError={(e)=>{(e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image'}}
                                        />
                                    {product.isSold && <div style={styles.soldBadge}>SOLD</div>}
                                </div>
                                <div style={styles.cardBody}>
                                    <h3 style={styles.price}>₹ {product.price.toLocaleString('en-IN')}</h3>
                                    <h4 style={styles.title}>{product.title}</h4>
                                    <p style={styles.description}>{product.description}</p>
                                    <div style={styles.meta}>
                                        {/* <span>Category: {product.category}</span> */}
                                        <span style={{ fontWeight: 'bold', color: product.isSold ? '#dc3545' : '#23e5a0' }}>
                                            Status: {product.isSold ? 'Sold' : 'Active Listing'}
                                        </span>

                                        <button
                                        onClick={()=>handleDelete(product._id,product.title)}
                                        style={styles.deleteBtn}
                                        >
                                            🗑️ Delete Advertisement
                                        </button>

                                    </div>

                                </div>
                            </div>
                            

                        ))}
                    </div>
                )}
            </div>
        </div>
    )

}

const styles = {
    pageWrapper: {background: '#eeebeb', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const },
    container: { padding: '2rem 1rem', width: '100%', maxWidth: '1240px', margin: '0 auto', boxSizing: 'border-box' as const, fontFamily: 'Roboto, Arial, sans-serif' },
    heading: { color: '#002f34', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' },
    centeredMessage: { display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', fontSize: '1.2rem', fontFamily: 'sans-serif', color: '#002f34' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.75rem' },
    card: { background: '#fff', border: '1px solid #e3e7eb', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, position: 'relative' as const, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    imageWrapper: { position: 'relative' as const, height: '180px', width: '100%', backgroundColor: '#f8f9fa' },
    image: { width: '100%', height: '100%', objectFit: 'cover' as const },
    soldBadge: { position: 'absolute' as const, top: '12px', left: '12px', backgroundColor: '#ff4d4f', color: '#fff', padding: '0.3rem 0.75rem', fontWeight: 'bold' as const, borderRadius: '4px', fontSize: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    cardBody: { padding: '1.25rem', display: 'flex', flexDirection: 'column' as const, flexGrow: 1 },
    price: { margin: '0 0 0.35rem 0', fontSize: '1.5rem', color: '#002f34', fontWeight: 700 },
    title: { margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 600, color: '#4a4a4a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
    description: { fontSize: '0.88rem', color: '#728183', margin: '0 0 1.25rem 0', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', lineHeight: '1.4' },
    deleteBtn: { width: '100%', padding: '0.65rem', backgroundColor: '#fff', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '4px', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s ease', marginTop: '0.5rem' },
    meta: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', fontSize: '0.85rem', color: '#556466', borderTop: '1px solid #f2f4f5', paddingTop: '0.75rem' }
};
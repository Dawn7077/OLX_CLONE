import { useDispatch, useSelector } from "react-redux";
import type { RootState,AppDispatch } from "../app/store";
import { useEffect, useState } from "react";
import { fetchProducts } from "../features/productSlice";
import { addToCart } from "../features/cartSlice";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";


export default function ProductList(){
    const dispatch  = useDispatch<AppDispatch>()
    const [confirmMsg,setMsg] = useState<string| null>(null)
    const {items,isLoading,isError,message}= useSelector((state:RootState)=>state.products)
    const [currentPage,setPage] = useState<number>(1)
    const itemsPerPage = 3

    function handleAddToCart(product:any){
        dispatch(addToCart(product))
        setMsg(`🎉 "${product.title}" added to your cart!`)
        setTimeout(()=>{
            setMsg(null)
        },2500)
    }

    useEffect(()=>{
        dispatch(fetchProducts())
    },[dispatch])

    if(isLoading){
        return (
            <div style={styles.centeredMessage}>
                <div style={{ textAlign: 'center' }}>
                    <p>Loading market listings...</p>
                    <Link to="/" style={{ color: '#002f34', fontSize: '1rem', fontWeight: 'bold' }}>Back to Home</Link>
                </div>
            </div>
        )
    }
    if(isError){
        return(
            <div style={styles.centeredMessage}>
                <div style={{ textAlign: 'center', color: '#dc3545' }}>
                    <p>Error: {message}</p>
                    <Link to="/" style={{ color: '#002f34', fontSize: '1rem', fontWeight: 'bold' }}>Back to Home</Link>
                </div>
            </div>
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = items.slice(indexOfFirstItem,indexOfLastItem)
    const totalPages = Math.ceil(items.length / itemsPerPage)

    const handlePageChange = (pageNum:number)=>{
        setPage(pageNum)
        window.scrollTo({top:0,behavior:'smooth'})
    }


    return(
        <div style={styles.pageBackground}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.headerRow}>
                    <h2 style={styles.heading}>New Recommendations</h2>
                </div>

                {confirmMsg && (
                    <div style={styles.toastNotification}>
                        {confirmMsg}
                    </div>
                )}

                {items.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '1.2rem', color: '#4a4a4a', margin: 0 }}>No products available for sale right now.</p>
                    </div>
                ) : (
                    <>
                        <div style={styles.grid}>
                            {currentItems.map((product) => (
                                <div key={product._id} style={styles.card}>
                                    <div style={styles.imageContainer}>
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.title}  
                                            style={styles.image}
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image' }}
                                        />
                                        <span style={styles.badge}>{product.category}</span>
                                    </div>

                                    <div style={styles.cardBody}>
                                        <h3 style={styles.price}>₹ {product.price.toLocaleString('en-IN')}</h3>
                                        <h4 style={styles.title} title={product.title}>{product.title}</h4>
                                        <p style={styles.description}>{product.description}</p>
                                        
                                        <div style={styles.meta}> 
                                            <span style={styles.seller}>✉️ {product.seller?.email || 'unknown'}</span>
                                        </div>
                                        <button style={styles.cartButton} onClick={() => handleAddToCart(product)}>
                                            Add to Cart
                                        </button>
                                    </div> 
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div style={styles.paginationContainer}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={{ ...styles.pageBtn, ...(currentPage === 1 ? styles.disabledPageBtn : {}) }}
                                >
                                    ◀ Prev
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, ind) => {
                                    const pageNum = ind + 1;
                                    return (
                                        <button 
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            style={{ 
                                                ...styles.pageBtn, 
                                                ...(currentPage === pageNum ? styles.activePageBtn : {}) 
                                            }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={{ ...styles.pageBtn, ...(currentPage === totalPages ? styles.disabledPageBtn : {}) }}
                                >
                                    Next ▶
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}





const styles = {
    pageBackground: {
        backgroundColor: '#f2f4f5',
        minHeight: '100vh',
        fontFamily: 'Roboto, Arial, sans-serif'
    },
    container: { 
        padding: '2rem 1rem', 
        maxWidth: '1240px', 
        margin: '0 auto'
    },
    headerRow: {
        marginBottom: '2rem',
        borderBottom: '1px solid #e3e7eb',
        paddingBottom: '0.75rem'
    },
    heading: { 
        color: '#002f34', 
        fontSize: '1.75rem',
        fontWeight: 700,
        margin: 0
    },
    centeredMessage: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh', 
        fontFamily: 'sans-serif' 
    },
    loadingBox: {
        textAlign: 'center' as const
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #ccd5d6',
        borderTop: '4px solid #002f34',
        borderRadius: '50%',
        margin: '0 auto',
        animation: 'spin 1s linear infinite'
    },
    errorBox: {
        textAlign: 'center' as const,
        backgroundColor: '#fff1f0',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #ffccc7',
        color: '#ff4d4f',
        fontWeight: 'bold'
    },
    errorLink: {
        color: '#002f34', 
        textDecoration: 'none', 
        fontWeight: 'bold',
        borderBottom: '2px solid #002f34'
    },
    emptyState: {
        textAlign: 'center' as const,
        padding: '4rem 2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', 
        gap: '1.75rem' 
    },
    card: { 
        background: '#fff', 
        border: '1px solid #e3e7eb', 
        borderRadius: '4px', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column' as const, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'relative' as const
    },
    imageContainer: {
        position: 'relative' as const,
        width: '100%',
        height: '180px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #f2f4f5'
    },
    image: { 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover' as const 
    },
    badge: {
        position: 'absolute' as const,
        top: '10px',
        left: '10px',
        backgroundColor: '#fff',
        color: '#002f34',
        padding: '0.25rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold' as const,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textTransform: 'uppercase' as const
    },
    cardBody: { 
        padding: '1.25rem', 
        display: 'flex', 
        flexDirection: 'column' as const, 
        flexGrow: 1 
    },
    price: { 
        margin: '0 0 0.35rem 0', 
        fontSize: '1.5rem', 
        color: '#002f34',
        fontWeight: 700
    },
    title: { 
        margin: '0 0 0.5rem 0', 
        fontSize: '1.05rem', 
        fontWeight: 600, 
        color: '#4a4a4a', 
        whiteSpace: 'nowrap' as const, 
        overflow: 'hidden', 
        textOverflow: 'ellipsis' 
    },
    description: { 
        fontSize: '0.88rem', 
        color: '#728183', 
        margin: '0 0 1.25rem 0', 
        flexGrow: 1, 
        display: '-webkit-box', 
        WebkitLineClamp: 2, 
        WebkitBoxOrient: 'vertical' as const, 
        overflow: 'hidden',
        lineHeight: '1.4'
    },
    meta: { 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.8rem', 
        color: '#556466', 
        borderTop: '1px solid #f2f4f5', 
        paddingTop: '0.75rem', 
        marginBottom: '1rem' 
    },
    seller: { 
        textOverflow: 'ellipsis', 
        overflow: 'hidden', 
        whiteSpace: 'nowrap' as const,
        maxWidth: '100%'
    },
    cartButton: { 
        width: '100%', 
        padding: '0.75rem', 
        backgroundColor: '#002f34', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        fontWeight: 'bold' as const, 
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'background-color 0.2s'
    },
    toastNotification: {
        position: 'fixed' as const,
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#002f34',
        color: '#fff',
        padding: '1rem 2.5rem',
        borderRadius: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontWeight: 'bold' as const,
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    paginationContainer: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginTop: '3.5rem' 
    },
    pageBtn: { 
        padding: '0.6rem 1.1rem', 
        background: '#fff', 
        border: '1px solid #002f34', 
        color: '#002f34', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontWeight: 'bold' as const,
        fontSize: '0.9rem'
    },
    activePageBtn: { 
        background: '#002f34', 
        color: '#fff' 
    },
    disabledPageBtn: { 
        opacity: 0.3, 
        cursor: 'not-allowed', 
        border: '1px solid #ccd5d6', 
        color: '#728183' 
    }
};
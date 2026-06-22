import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";


export default function Home() { 
    const { user } = useSelector((state: RootState) => state.auth);

//   const linkStyle = { padding: '0.5rem 1rem', background: '#002f34', color: '#fff', textDecoration: 'none', borderRadius: '4px' };
  return(
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            <Navbar />

            <header style={{ backgroundColor: '#fff', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#002f34', marginBottom: '1rem' }}>
                    The Best Marketplace to Buy & Sell Items
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#575757', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    Find amazing deals on electronics, vehicles, fashion, and more right in your neighborhood.
                </p>
                
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <Link to="/Products" style={{ backgroundColor: '#002f34', color: '#fff', padding: '0.8rem 1.5rem', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        Browse Products
                    </Link>
                    {user && (
                        <Link to="/sell" style={{ backgroundColor: '#ffce32', color: '#002f34', padding: '0.8rem 1.5rem', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                            + Start Selling
                        </Link>
                    )}
                </div>
            </header>

            {/* 3. Main Landing Body Context Content */}
            <main style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
                <h2 style={{ color: '#002f34', marginBottom: '1.5rem' ,marginTop:"150px"}}>Enjoy Shopping</h2>
                {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {['Electronics', 'Vehicles', 'Fashion'].map((category) => (
                        <Link 
                            to={`/Products?category=${category}`} 
                            key={category} 
                            style={{ backgroundColor: '#fff', padding: '2rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#002f34', textAlign: 'center', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', transition: 'transform 0.2s' }}
                        >
                            {category === 'Electronics' && '💻 '}
                            {category === 'Vehicles' && '🚗 '}
                            {category === 'Fashion' && '👕 '}
                            {category}
                        </Link>
                    ))}
                </div> */}
            </main>
        </div>
    );
}

//  <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
//         <h1>Welcome to OLX Market</h1>
//         <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
//             <Link to="/login" style={linkStyle}>Go to Login Page</Link>
//             <Link to='/register' style={linkStyle}>Signup</Link>
//             <Link to='/Products' style={linkStyle}>Product Page</Link>
//             <Link to='/sell' style={linkStyle}>Sell Product</Link>
//             <Link to='/cart' style={{ ...linkStyle, backgroundColor: '#ffca00', color: '#000' }}>🛒 Open Cart</Link>
//         </div>
//         </div>
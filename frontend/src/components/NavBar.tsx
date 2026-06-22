import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../app/store";
import { logout } from "../features/authSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { cartItems } = useSelector((state: RootState) => state.cart);
    const totalQty = cartItems.reduce((t, it) => t + it.quantity, 0);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav style={{ backgroundColor: '#002f34', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'sans-serif' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold' }}>OLX Clone</Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/Products" style={{ color: '#fff', textDecoration: 'none' }}>Productlists</Link>
                {user ? (
                    <>
                        <Link to="/sell" style={{ color: '#ffce32', textDecoration: 'none', fontWeight: 'bold' }}>+ SELL</Link>
                        <span style={{ color: '#23e5a0', fontWeight: 'bold', fontSize: '0.9rem' }}>{user.email}</span>
                        <Link to="/my-ads" style={{ color: '#fff', textDecoration: 'none' }}>My Ads</Link>
                        <button
                            onClick={handleLogout}
                            style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Sign Up</Link>
                    </>
                )}

                <Link to="/cart" style={{ color: '#002f34', backgroundColor: '#23e5a0', padding: '0.5rem 1rem', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                    🛒 Cart ({totalQty})
                </Link>
            </div>
        </nav>
    );
}
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login';
import ProductList from './components/ProductList';
import ProductList1 from './components/ProductList1';
import SellProduct from './components/SellProduct';
import Register from './components/Register';
import Cart from './components/Cart';
import Home from './components/Home';
import MyAds from './components/MyAds';

function App() { 

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/Products' element={<ProductList/>}/>
        <Route path='/sell' element={<SellProduct/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/my-ads' element={<MyAds/>}/>
      </Routes>
    </Router>    
  )
}

export default App

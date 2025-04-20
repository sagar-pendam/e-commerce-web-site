import Home from "./components/pages/Home";
import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import { useState, createContext, useEffect,useRef } from "react";
import ProductInfo from "./components/pages/ProductInfo";
import NotFound from "./components/pages/NotFound";
import Navbar from "./components/common/Navbar";
import Filter from "./components/common/Filter";
import Footer from "./components/common/Footer";
import Cart from "./components/pages/Cart";
import ProductList from "./components/pages/SearchedProductList";
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import ForgotPassword from "./components/pages/ForgotPassword";
import BuyNow from "./components/pages/BuyNow";
import  CartContext  from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./components/pages/Orders";
import Wishlist from "./components/pages/WishlistProducts";
import Conditions from "./components/pages/Conditions";
import Privacy from "./components/pages/Privacy";
import {auth} from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import NavigationAwareScroll from "./components/common/NavigationAwareScroll";
const App = () => {
  const [cartItems, setcartItems] = useState([])// To cart items
  const [totalPrice, settotalPrice] = useState()//Total Price
  const [products, setProducts] = useState([])
  const [category, setcategory] = useState([])//Storing Category Values 
  const [isFilterSelected, setisFilterSelected] = useState(false)
  const [originalPriceRange, setoriginalPriceRange] = useState(0)
  const [priceRange, setPriceRange] = useState(500);
  const [maxPrice, setmaxPrice] = useState(0)
  const [minPrice, setminPrice] = useState(0)
  const [user, setuser] = useState(null)
  const [priceApplied, setpriceApplied] = useState(false)
  const [authLoading, setAuthLoading] = useState(true);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setuser(currentUser);
      setAuthLoading(false); 
    });
    // Simulate delay for skeleton effect
    setTimeout(() => { 
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          //Storing Category Values 
          let arr = []
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            arr.push(element.category)

          }          
          let uniqueArray = [...new Set(arr)];         
          setcategory(uniqueArray)         
        });

    }, 2000);
    
  
    return () => unsubscribe();
  }, []);
  return (
    <CartContext.Provider value={{authLoading,user,setuser, priceApplied, setpriceApplied, minPrice, setminPrice, maxPrice, setmaxPrice, priceRange, setPriceRange, originalPriceRange, setoriginalPriceRange, products, setProducts, cartItems, setcartItems, totalPrice, settotalPrice, category, setcategory }}>



      <Router>
        <Navbar />
        <NavigationAwareScroll />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
          className="text-sm font-semibold"
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductInfo />} />
          <Route path="/product-list/:item" element={<ProductList />} />
        
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/buy-now/:id" element={<ProtectedRoute><BuyNow /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        <Footer />
      </Router>
    </CartContext.Provider>

  );
};

export default App;
export { CartContext };

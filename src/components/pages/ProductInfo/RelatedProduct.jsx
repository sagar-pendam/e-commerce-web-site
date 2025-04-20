import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SkeletonLoader from "../../skeletons/SkeletonLoader"; // Import Skeleton Loader
import { FaStar } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import CartContext from "../../../context/CartContext";
import { doc,updateDoc, collection,getDoc, addDoc, serverTimestamp, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase";
const Relatedproduct = ({ categoryItem }) => {
    const { user } = useContext(CartContext)
    const { cartItems, setcartItems, quantityOfItems, setquantityOfItems, products, setProducts } = useContext(CartContext)
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        setTimeout(() => {
            fetch(`https://fakestoreapi.com/products/category/${categoryItem}`)
                .then((res) => res.json())
                .then((data) => {
                  
                  

                    setProducts(data);
                    setLoading(false);
                });
        }, 2000);

       
    }, []);
    
    
    //Adding cart 
  const addToCart = async (item) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
    if(user){
      if (userSnap.exists()) {
        
        const cartItems = userSnap.data().cart || [];
        const itemExists = cartItems.some(cartItem => cartItem.id === item.id);
        // If item exists, update quantity
        if (itemExists) {
          const updatedCart = cartItems.map(cartItem => {
            if (cartItem.id === item.id) {
              return { ...cartItem, quantity: cartItem.quantity + 1, price: item.price };

            }
            return cartItem
          }
          )
          await updateDoc(userRef, { cart: updatedCart }, { merge: true });
          toast.success('Item Added');
          return;
        }
        // If item doesn't exist, add it to cart
        else{
          await setDoc(userRef, {
            cart: arrayUnion({...item,quantity: 1})
          }, { merge: true });
          toast.success('Item Added');
        }

       
      }
      else{
        await setDoc(userRef, {
          cart: arrayUnion(item)
        }, { merge: true });
      }
    }
    else{
      toast.error("Please sign in to add to cart");
      navigate("/signin")
    }
      
    }
    catch (error) {
      console.error("Error adding to cart: ", error);
      toast.error("Error adding to cart");
    }
  }
    return (
        <div className="p-4 w-full">
            {/* **Horizontal Scrollable product List** */}

            <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Related products</h1>

            {loading ? (
                // **Horizontal Skeleton Loader**
                <div className="overflow-x-auto w-full whitespace-nowrap py-2">
                    <div className="flex gap-4">
                        {Array(6).fill(0).map((_, index) => (
                            <SkeletonLoader key={index} className="min-w-[200px] w-[200px] h-[300px]" />
                        ))}
                    </div>
                </div>
            ) : (
                // **Horizontal Scrollable product List**
                <motion.div
                    className="overflow-x-auto w-full  whitespace-nowrap py-2 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-slate-400 "
                    whileTap={{ cursor: "grabbing" }}
                >          <div className="flex gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, boxShadow: "0px 4px 8px rgba(0,0,0,0.15)" }}
                                className="border p-4 rounded-lg shadow-md cursor-pointer bg-white transition-all duration-300 min-w-[200px] w-[220px]"
                            >
                                <img src={product.image} alt={product.title} className="h-32 mx-auto object-contain" />
                                <h2 className="text-lg font-semibold mt-3 text-center w-full min-h-[40px] max-h-[60px] overflow-hidden text-ellipsis whitespace-normal">
                                    {product.title}
                                </h2>
                                <p className="text-gray-600 text-center">${product.price}</p>

                                {/* Rating */}
                                <div className="flex items-center justify-center text-green-400 gap-1">
                                    <FaStar /> <span>{product.rating.rate}</span>
                                </div>

                                <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={`/product/${product.id}`} className="block text-center text-blue-500 mt-2 font-medium">
                                    View Details
                                </Link>

                                {/* Add to Cart */}
                                <motion.button
                                    className="flex gap-2 items-center bg-yellow-400 px-4 py-2 rounded-sm mx-auto my-4 font-semibold hover:text-gray-800"
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => { addToCart(product) }}
                                >
                                    Add to <BsCart3 />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Relatedproduct;

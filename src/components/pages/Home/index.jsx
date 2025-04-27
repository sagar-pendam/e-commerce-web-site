import { useEffect, useState, useContext } from "react";
import { Link, useLocation,useNavigate  } from "react-router-dom";
import { motion } from "framer-motion";
import SkeletonLoader from "../../skeletons/SkeletonLoader"; // Import Skeleton Loader
import { FaStar } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import CartContext from "../../../context/CartContext";
import Filter from "../../common/Filter";
import Wishlist from "../../common/Wishlist";
import { db, auth } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc,updateDoc, collection,getDoc, addDoc, serverTimestamp, setDoc, arrayUnion } from "firebase/firestore";
import CircleLoader from "../../common/CircleLoader";
const Home = () => {
  const { user, setuser, cartItems, setcartItems, quantityOfItems, setquantityOfItems, products, setProducts } = useContext(CartContext)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => { // Simulate delay for skeleton effect
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        });
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setuser(user);
        
      } else {
        setuser(null);
       
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
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
    <div className="p-4 min-h-screen">

      <Filter />
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Products</h1>

      {loading ? (
        // Skeleton loaders for better UX
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        products.length > 0 ? (
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, boxShadow: "0px 4px 8px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="border p-4 rounded-lg shadow-md cursor-pointer bg-white transition-all duration-300"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-40 mx-auto object-contain"
              />
              <h2 className="text-lg font-semibold mt-3 text-center">{product.title}</h2>
              <p className="text-gray-600 text-center">${product.price}</p>
              {/* Rating Details */}
              <div className="flex items-center justify-center text-green-400 gap-1">
                <FaStar /> <span>{product.rating.rate}</span>

              </div>
              <Link
                to={`/product/${product.id}`}
                className="block text-center text-blue-500 mt-2 font-medium"
              >
                View Details
              </Link>
              {/* Add to Cart */}
              <motion.button
                className="flex gap-2 items-center bg-yellow-400 px-4 py-2 rounded-sm mx-auto my-4 font-semibold hover:text-gray-800"
                whileHover={{
                  scale: [null, 1.1, 1.2],
                  transition: {
                    duration: 0.3,
                    times: [0, 0.5, 1],
                    ease: ["easeInOut", "easeOut"],
                  },
                }}

                onClick={() => { addToCart(product) }}
              >
                Add to <BsCart3 />
              </motion.button >
               {/* Wishtlist  */}
              <motion.div initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 4px 8px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.97 }}
                className="border p-4 rounded-lg w-fit shadow-md cursor-pointer bg-white transition-all duration-300">
                <Wishlist product={product} />

              </motion.div> 
            </motion.div>
          ))}
        </div>
        ):
        <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold text-gray-500">No Products Found</h2>
      </div>
      
      )}
    </div>
  );
};

export default Home;

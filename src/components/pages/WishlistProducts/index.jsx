import React, { useEffect, useState, useContext ,useCallback} from 'react'
import CartContext from '../../../context/CartContext'
import { collection, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { toast } from 'react-toastify';
import { Heart } from 'lucide-react';
import { useNavigate, Link ,NavLink} from 'react-router-dom';
import WatchList from '../../common/Wishlist';
import * as motion from "motion/react-client"
import { BsCart3 } from "react-icons/bs";
import WishlistSkeleton from '../../skeletons/WIshlistSkeleton';
function WishlistProducts() {
    const { user } = useContext(CartContext)
    const [loading, setloading] = useState(true)
    const [wishlistProductsList, setwishlistProductsList] = useState([])

    const showAllWishlistProducts = async () => {
     
        try{
          setloading(true)
          const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const wishlist = userSnap.data().wishlist || [];
            setwishlistProductsList(wishlist)
        }
        }
        catch (error) {
            console.error("Error fetching wishlist data: ", error);
            toast.error("Error fetching wishlist data");
        }
        finally { 
        setloading(false)
        }
    }

    useEffect(() => {
        if (user) {
            showAllWishlistProducts()
        }
    }, [])

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
    //Removing from wishlist
    const removeFromWishlist = useCallback(async (id) => {
      setwishlistProductsList(prevList => prevList.filter(item => item.id !== id));
    }, []);
    
    return (
        <div>
            <div className='flex min-h-screen flex-col items-center justify-center'>
                <h1 className='text-3xl font-bold text-center mt-10'>Your Wishlist</h1>
                <motion.div   initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
            }} className='flex flex-col gap-4 p-5 w-full '>
                    {loading ? (
                        <WishlistSkeleton />
                    ) : ( wishlistProductsList.length === 0 ? 
                        <div className='flex  flex-col items-center justify-center'>
                            <img src="https://cdn-icons-png.flaticon.com/512/107/107831.png" alt="empty wishlist" className='w-44 h-44' />
                            <h1 className='text-2xl font-bold'>Your Wishlist is Empty</h1>
                            <p className='text-gray-500'>Add items to your wishlist to see them here.</p>
                            <Link to={"/"} className='bg-yellow-400 px-4 py-2 rounded-full mt-4'>Browse Products</Link>
                        </div>:
                        wishlistProductsList.map((product) => (


                            <div key={product.id} className='bg-white border-2 flex-wrap items-center  flex-col md:flex-row p-5 flex gap-10 shadow-md rounded-lg max-w-full'>
                                {/* Left Div */}
                                <Link to={`/product/${product.id}`}> <img src={product.image} alt={product.title} className='w-44 h-44  rounded-lg' /></Link>
                                {/* Right Div */}
                                <div className='flex flex-col gap-4 items-center md:items-start  text-center md:text-left'>
                                    <Link to={`/product/${product.id}`} className='text-xl font-semibold '>{product.title}</Link>
                                    <p className='text-gray-700'>${product.price}</p>
                                    
                                    {/* Add to Cart */}
                                    <motion.button
                                        className="flex gap-2 items-center bg-yellow-400 px-4 py-2 w-fit  rounded-full   font-semibold hover:text-gray-800"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => { addToCart(product) }}
                                    >
                                        Add to <BsCart3 />
                                    </motion.button >
                                    {/* Buy Now */}
                                    <NavLink  to={"/buy-now/" + product.id}
                                        state={{
                                            id: product.id,
                                            title: product.title,
                                            price: product.price,
                                            image: product.image,
                                        }}
                                        className="bg-orange-400 w-fit px-4 py-2 rounded-full">Buy Now</NavLink>
                                    {/* Watchlist */}
                                      <div className='px-4'>
                                      <WatchList product={product} removeFromWishlist={removeFromWishlist} />
                                        </div>  
                                </div>

                            </div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default WishlistProducts

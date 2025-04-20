import { useEffect, useState,useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import * as motion from "motion/react-client"
import SkeletonLoader from "../../skeletons/SkeletonLoader";
import CircleLoader from "../../common/CircleLoader";
import { FaStar } from "react-icons/fa";
import Reviews from "./Reviews";
import { BsCart3 } from "react-icons/bs";
import RelatedProduct from "./RelatedProduct";
import Wishlist from "../../common/Wishlist";
import { db } from "../../../firebase";
import { toast } from "react-toastify";
import CartContext from "../../../context/CartContext";
import { doc,updateDoc, collection,getDoc, addDoc, serverTimestamp, setDoc, arrayUnion } from "firebase/firestore";
function ProductInfo() {
    const { user } = useContext(CartContext)
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data));
    }, [id]);

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
            if (cartItem.id === Number(id)) {
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


    if (!product) return <div className="flex items-center justify-center "><CircleLoader /></div>;

    return (
        <div className=" flex items-start flex-col justify-start px-4  w-full min-h-screen my-4">
            <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                      duration: 0.8,
                      delay: 0.5,
                      ease: [0, 0.71, 0.2, 1.01],
                  }}
                className="flex items-start  w-full"
            >

                <div className="p-8 flex flex-col justify-center   border-2  mt-16 rounded-3xl shadow-xl  w-full gap-8 " >
                    <img src={product.image} alt={product.title} className="h-48 mx-auto" />
                    <div className="flex flex-col  gap-4">
                        <h1 className="text-2xl font-bold mt-2">{product.title}</h1>
                        <p className="text-gray-600 font-bold">${product.price}</p>
                        <p className="mt-2">{product.description}</p>
                        <div className="flex items-center justify-start text-green-400 gap-1">
                            <FaStar /> <span>{product.rating.rate}</span>

                        </div>
                        {/* Add to Cart */}
                        <motion.button
                            className="flex gap-2 items-center bg-yellow-400 px-4 py-2 w-fit  rounded-full   font-semibold hover:text-gray-800"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { addToCart(product) }}
                        >
                            Add to <BsCart3 />
                        </motion.button >
                        {/* Favorite  */}
                        <motion.div initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.03, boxShadow: "0px 4px 8px rgba(0,0,0,0.15)" }}
                            whileTap={{ scale: 0.97 }}
                            className="border p-4 rounded-lg w-fit shadow-md cursor-pointer bg-white transition-all duration-300">
                            <Wishlist product={product} />

                        </motion.div>
                        {/* Buy Now */}
                        <NavLink to={"/buy-now/" + product.id}
                            
                            className="bg-orange-400 w-fit px-4 py-2 rounded-full">Buy Now</NavLink>
                    </div>
                    {/* Reviews Details*/}
                    <Reviews product={product} />

                </div>

            </motion.div>

            <RelatedProduct categoryItem={product.category} />
        </div>
    );
}

export default ProductInfo

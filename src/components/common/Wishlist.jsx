import React,{useState,useContext,useEffect} from 'react'
import { Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { db,auth } from "../../firebase";
import { doc, updateDoc, arrayUnion,setDoc,getDoc } from "firebase/firestore";
import  CartContext  from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
function Wishlist({product,removeFromWishlist}) {
    const {user} = useContext(CartContext)
    const [loading, setloading] = useState(false)
    const navigate = useNavigate();
    const [isInWishlist, setisInWishlist] = useState(false)
    const addToWishlist = async () => {
        setloading(true)
        try {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                 const userSnap = await getDoc(userRef);
                if(userSnap.exists()) {
                    const wishlist = userSnap.data().wishlist || [];
                    // Check if the product is already in the wishlist
                    if (wishlist.some(item => item.id === product.id)) {
                        // Filter out the wishlist to be removed 
                        const updatedWishlist = wishlist.filter(item => item.id !== product.id);
                        await updateDoc(userRef, {
                            wishlist: updatedWishlist
                        });
                        setloading(false)
                        setisInWishlist(false)
                        // If removeFromWishlist function is provided, call it
                        // to remove the product from the wishlist
                        if(removeFromWishlist){
                            removeFromWishlist(product.id)
                        }
                        toast.success("Product removed from wishlist");
                        return;
                    }
                    // If not, add the product to the wishlist
                    else{
                        await setDoc(userRef, {
                            wishlist: arrayUnion(product)
                        },{merge:true});
                        toast.success("Product added to wishlist");
                        setloading(false)
                        setisInWishlist(true)
                        return;
                    }
                }
               
            } else {
                toast.error("Please sign in to add to wishlist");
                navigate("/signin")
            }
        } catch (error) {
            console.error("Error adding to wishlist: ", error);
            toast.error("Error adding to wishlist");
        } finally {
            setloading(false)
        }
    }
    
    // Check if the product is already in the wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if(userSnap.exists()) {
                    const wishlist = userSnap.data().wishlist || [];
                    setisInWishlist(wishlist.some(item => item.id === product.id));
                }
            }
        }
        checkWishlist();
    }, [user, product.id]);
    
    return (
        
             <Heart onClick={()=>{addToWishlist()}} className={`text-red-400  transition-all duration-300 ${isInWishlist ? "fill-red-400":""} hover:fill-red-400 ${loading ? "opacity-50 cursor-not-allowed":" opacity-100 cursor-pointer" }`} />
       
    )
}

export default Wishlist

import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import CartContext from '../../../context/CartContext';
import * as motion from "motion/react-client"
import { FaStar, FaPlus, FaMinus } from "react-icons/fa";
import { CiShare1 } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineMail, MdEmail } from "react-icons/md";
import { CiFacebook } from "react-icons/ci";
import { RiTwitterXFill } from "react-icons/ri";
import { BiLogoWhatsappSquare } from "react-icons/bi";
import { MdOutlineCopyAll } from "react-icons/md";
import { collection, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { toast } from 'react-toastify';
import { Plus, Minus, Loader } from 'lucide-react';
import CartSkeleton from '../../skeletons/CartSkeleton';
function Cart() {
    const { user, setuser, cartItems, setcartItems } = useContext(CartContext)
    const [subTotalItems, setsubTotalItems] = useState(0)
    const [isOpen, setisOpen] = useState(false)
    const [openShareId, setOpenShareId] = useState(null); // Track which share UI is open
    const shareRef = useRef(null); // Reference to share UI
    const [copied, setCopied] = useState(false);
    const message = encodeURIComponent("Check out this amazing product!");
    const [loading, setloading] = useState(true)
    const [loadingItemId, setLoadingItemId] = useState(null);
    const [totalPrice, settotalPrice] = useState(0)
    const baseUrl = window.location.origin;

    const showAllCartItems = async () => {
        try {
            setloading(true)
            //Checking if user is logged in or not
            if (user) {
                const userRef = doc(db, "users", user.uid)
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {

                    const cart = userSnap.data().cart || [];
                    setcartItems(cart)
                    //Counting total items
                    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
                    setsubTotalItems(totalItems)
                    //Counting total price
                    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
                    settotalPrice(totalAmount)


                }
            }
            else {
                toast.error("Please sign in to view cart items");
            }
        }
        catch (error) {
            console.log("Error fetching cart items:", error);
            toast.error("Error fetching cart items");
        }
        finally {
            setloading(false)

        }

    }

    useEffect(() => {

        showAllCartItems()

    }, [])


    const updateOrAddItem = async (id, newQuantity, price, action) => {
        if (action === "increase") {
            try {
                setLoadingItemId(id)

                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (user) {
                    if (userSnap.exists()) {

                        const cartItems = userSnap.data().cart || [];
                        const itemExists = cartItems.some(cartItem => cartItem.id === id);
                        const cartItem = cartItems.find(cartItem => cartItem.id === id);
                        // If item exists, update quantity
                        if (itemExists) {
                            if (cartItem.quantity > 2 && action === "increase") {
                                toast.error("You can only add 3 items");
                                //Counting total items
                                const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
                                setsubTotalItems(totalItems)
                                //Counting total price
                                const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                                settotalPrice(totalAmount)
                                return;
                            }
                            else {
                                const updatedCart = cartItems.map(cartItem => {
                                    if (cartItem.id === id) {
                                        return { ...cartItem, quantity: cartItem.quantity + 1 };

                                    }
                                    return cartItem
                                }
                                )
                                await updateDoc(userRef, { cart: updatedCart }, { merge: true });
                                toast.success('Item Added');
                                setcartItems(updatedCart)
                                //Counting total items
                                const totalItems = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
                                setsubTotalItems(totalItems)
                                //Counting total price
                                const totalAmount = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0)
                                settotalPrice(totalAmount)
                                return;
                            }

                        }



                    }

                }
                else {
                    toast.error("Please sign in to add to cart");
                    navigate("/signin")
                }

            }
            catch (error) {
                console.error("Error adding to cart: ", error);
                toast.error("Error adding to cart");
            }
            finally {
                setLoadingItemId(null)
            }
        }
        if (action === "decrease") {
            try {
                setLoadingItemId(id)
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists) {
                        const cartItems = userSnap.data().cart || [];
                        const itemExists = cartItems.some(cartItem => cartItem.id === id);
                        const cartItem = cartItems.find(cartItem => cartItem.id === id);
                        //if item exists, update quantity
                        if (cartItem.quantity > 1 && action === "decrease") {
                            const updatedCart = cartItems.map(cartItem => {
                                if (cartItem.id === id) {
                                    return { ...cartItem, quantity: cartItem.quantity - 1 };

                                }
                                return cartItem
                            }
                            )
                            await updateDoc(userRef, { cart: updatedCart }, { merge: true });
                            toast.success('Item removed');
                            setcartItems(updatedCart)
                            //Counting total items
                            const totalItems = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
                            setsubTotalItems(totalItems)
                            //Counting total price
                            const totalAmount = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0)
                            settotalPrice(totalAmount)
                            return;
                        }
                        else {
                            const updatedCart = cartItems.filter(cartItem => cartItem.id !== id);
                            await updateDoc(userRef, { cart: updatedCart }, { merge: true });
                            toast.success('Item removed');
                            setcartItems(updatedCart)

                            return;
                        }
                    }
                }
                else {
                    toast.error("Error: Please sign in to update cart items");
                }
            }
            catch {
                toast.error("Error updating cart item");
                console.log("Error updating cart item:", error);
            }
            finally {
                setLoadingItemId(null)
            }
        }
    };


    //Delete cart item
    const deleteCart = async (product) => {
        try {

            if (user) {
                const userRef = doc(db, "users", user.uid)
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const cart = userSnap.data().cart || [];
                    const updatedCart = cart.filter((item) => item.id !== product.id);
                    await updateDoc(userRef, { cart: updatedCart }, { merge: true });
                    setcartItems(updatedCart)

                    //Counting total items
                    const totalItems = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
                    setsubTotalItems(totalItems)
                    //Counting total price
                    const totalAmount = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0)
                    settotalPrice(totalAmount)

                    toast.success("Item deleted from cart");
                }
            }
            else {
                toast.error("Error: Please sign in to delete cart items");
            }
        }
        catch (error) {
            toast.error("Error deleting cart item");
            console.log("Error deleting cart item:", error);

        }
        finally {

        }

    }


    //Adding event listener to close of share UI
    const shareBtn = (value) => {
        if (value) {
            setisOpen(true)
        }
        else {
            setisOpen(false)
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
                setOpenShareId(null); // Close the share UI
            }
        }

        if (openShareId !== null) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            document.body.style.overflow = "auto"; // Enable scrolling
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "auto"; // Restore scrolling on unmount
        };
    }, [openShareId]);


    //Adding event listener to copy text to clipboard
    const copyText = async (text) => {

        try {
            await navigator.clipboard.writeText("Hello, Copy me!");
            setCopied(true);

            // Hide the tooltip after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }
    if (loading) return <CartSkeleton />
    //Checking if cart is empty or not
    if (cartItems.length == 0) return <motion.div initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
        }} className='flex flex-col min-h-screen items-center justify-center'>
        <h1 className='text-4xl my-6 font-bold'>Cart Items</h1>
        <img src="https://cdn-icons-png.flaticon.com/512/107/107831.png" alt="empty wishlist" className='w-44 h-44' />
        <h1 className='text-2xl font-bold'>Your Cart Page is Empty</h1>
        <p className='text-gray-500'>Add items to your cart to see them here.</p>
        <Link to={"/"} className='bg-yellow-400 px-4 py-2 rounded-full mt-4'>Browse Products</Link>
    </motion.div>

    return (
        <div className=" flex items-start flex-col justify-start px-4  w-full my-4 relative">

            <h1 className='text-3xl font-bold'>Shopping Cart</h1>
            <p className='self-end px-8'>Price</p>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }}
                className="flex items-start  w-full flex-col justify-center"
            >

                {cartItems.map((product, index) => {
                    return <div key={index} className="p-8 flex md:flex-nowrap flex-wrap  relative  border-2  mb-16 rounded-3xl shadow-xl  w-full gap-8 " >
                        <img src={product.image} alt={product.title} className="h-48 mx-auto" />
                        <div className="flex flex-col  gap-2">
                            <Link
                                to={`/product/${product.id}`}
                                className="block text-center text-blue-500 mt-2 font-medium"
                            >
                                <h1 className="text-2xl font-bold mt-2">{product.title}</h1>
                            </Link>


                            <p className="mt-2 text-wrap">{product.description}</p>
                            <p className='text-green-400'>In stock</p>
                            <div className="flex items-center justify-start text-green-400 gap-1">
                                <FaStar /> <span>{product.rating.rate}</span>

                            </div>
                            {/* Save & Delete & Share */}
                            <div className='sds flex gap-4 flex-wrap'>
                                {/* Add & Remove Item*/}
                                <div className='btn flex items-center gap-2'>
                                    <button className='px-3 py-2 rounded-sm  text-sm' onClick={() => { updateOrAddItem(product.id, product.quantity, product.price, "decrease") }}> <Minus className='w-4 h-4 text-gray-800' /></button>
                                    {loadingItemId === product.id ? (
                                        <Loader className="h-4 w-4 animate-spin text-blue-500" />
                                    ) : (
                                        <span className='text-xl'>{product.quantity}</span>
                                    )}


                                    <button className='px-3 py-2 rounded-sm  text-sm' onClick={() => { updateOrAddItem(product.id, product.quantity, product.price, "increase") }}><Plus className='w-4 h-4 text-gray-800' /></button>
                                </div>

                                {/* Delete button */}
                                <button className='bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded-sm' onClick={() => { deleteCart(product) }}>Delete</button>
                                {/* Share Button */}
                                <button className='text-1xl flex gap-1 items-center text-blue-500 cursor-pointer hover:text-blue-400 ' onClick={() => { shareBtn(true); setOpenShareId(openShareId === product.id ? null : product.id) }}>Share <CiShare1 /></button>


                            </div>

                        </div>
                        <p className="text-gray-600 font-bold">
                            ${!isNaN(product.price) ? Number(product.price).toFixed(2) : '0.00'}
                        </p>


                        {/* share UI */}
                        {openShareId === product.id && (
                            <div ref={shareRef} // Attach ref to Share UI div

                                className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-slate-800 border py-20 px-20 rounded-md gap-6 justify-around shadow-xl"
                            >
                                {/* Close Button */}
                                <button className="text-3xl hover:text-gray-300 absolute cursor-pointer right-2 top-2 text-white" onClick={() => { setOpenShareId(null); shareBtn(false) }}>
                                    <IoCloseOutline />
                                </button>

                                {/* Social Media Share Links */}
                                <div className="shareList flex gap-4 items-center justify-center">
                                    {/* Email Share */}
                                    <a
                                        href={`mailto:?subject=Check out this product: ${encodeURIComponent(product.name)}&body=${encodeURIComponent(
                                            `${message}\n\n${product.description}\n\nView here: https://e-commerce-db-f9711.web.app/product/${product.id}`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share via Email"
                                        className="text-4xl hover:text-gray-300 text-white transition-colors"
                                    >
                                        <MdEmail />
                                    </a>

                                    {/* Facebook Share */}
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                            `https://e-commerce-db-f9711.web.app/product/${product.id}`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on Facebook"
                                        className="text-4xl hover:text-gray-300 text-white transition-colors"
                                    >
                                        <CiFacebook />
                                    </a>

                                    {/* Twitter (X) Share */}
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                            `${message} - ${product.name}`
                                        )}&url=${encodeURIComponent(
                                            `https://e-commerce-db-f9711.web.app/product/${product.id}`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on Twitter"
                                        className="text-4xl hover:text-gray-300 text-white transition-colors"
                                    >
                                        <RiTwitterXFill />
                                    </a>

                                    {/* WhatsApp Share */}
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(
                                            `${message}\n\n${product.name}\n\n${`https://e-commerce-db-f9711.web.app/product/${product.id}`}`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on WhatsApp"
                                        className="text-4xl hover:text-gray-300 text-white transition-colors"
                                    >
                                        <BiLogoWhatsappSquare />
                                    </a>
                                </div>

                                {/* Copy URL Section */}
                                <div className="url flex flex-wrap gap-2 items-center text-white">
                                    {`https://e-commerce-db-f9711.web.app/product/${product.id}`}
                                    <div className="copyurl flex gap-2 text-white border py-1 rounded-sm items-center w-fit px-2 relative">
                                        <span className='font-bold'>Copy</span>
                                        <button className="cursor-pointer text-white" onClick={() => { copyText(`https://e-commerce-db-f9711.web.app/product/${product.id}`) }}><MdOutlineCopyAll /> </button>
                                        {copied && (
                                            <span
                                                className={`absolute top-[40px] left-[100px] bg-gray-800 text-white text-sm px-2 py-1 rounded-md transition-opacity duration-500 ${copied ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                                    }`}
                                            >
                                                Copied!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                })}
            </motion.div>
            {/* Total Price Details */}
            <div className='flex self-end gap-2'>
                <h2>Subtotal (<span>{subTotalItems} Items)</span>:</h2>
                <h2 className='font-bold'>{totalPrice ? totalPrice.toFixed(2) : "0.00"}</h2>
            </div>
        </div>
    )
}

export default Cart

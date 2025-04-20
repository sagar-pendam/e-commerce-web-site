import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate ,Link} from "react-router-dom";
import { db, auth } from "../../../firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, getDocs, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CartContext from "../../../context/CartContext";
import OrdersSkeleton from '../../skeletons/OrdersSkeleton';
function Orders() {
    const { user } = useContext(CartContext)
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const navigate = useNavigate();
    useEffect(() => {

        const fetchOrderData = async () => {
            setLoading(true)
            try {

                const orderRef = collection(db, "users", user.uid, "orders")
                const orderSnap = await getDocs(orderRef);

                const orders = orderSnap.docs.map((doc) => (
                    {
                        orderId: doc.id,
                        ...doc.data()
                    }
                ))
                setOrders(orders)
                if (orders.length === 0) {
                  
                    setOrders([])
                }
                else {
                    setOrders(orders)
                }



            }
            catch (error) {
                toast.error("Error fetching order data:")
                console.error("Error fetching order data:", error);
            }
            finally {
                setLoading(false)
            }
        }
        fetchOrderData()
    }, [])
    return (
        <div className='flex flex-col items-center justify-center'>
            {loading ? <OrdersSkeleton /> : (
                orders?.length > 0 ?
                    <motion.div initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: [0, 0.71, 0.2, 1.01],
                        }} className='flex flex-col gap-4 p-5 w-full '>
                        {orders.map((order) => (
                            <div key={order.orderId} className='flex flex-col gap-4 p-5 w-full border-2 rounded-lg shadow-lg'>
                                <h1 className='text-2xl font-bold text-wrap'>Order ID: <span className='text-lg font-medium text-gray-500'>{order.orderId}</span></h1>
                                <p className='text-lg font-semibold'>Order Date : <span className='text-base font-medium text-gray-500'>{order.createdAt.toDate().toLocaleDateString()}</span></p>
                                <p className='text-lg font-semibold'>Total Amount: <span className='text-base font-medium text-gray-500'>${order?.product.productPrice * order?.product.productQuantity}</span></p>
                                <p className='text-lg font-semibold'><span className='font-semibold'>Shipping Address:</span> <span className='text-base font-medium text-gray-500'>{order.address}</span></p>
                                <div className='flex gap-2 items-center'>
                                    <div className='bg-green-400 rounded-full w-1 h-1'></div>
                                    <span className='font-semibold text-lg'>Status :</span>
                                    <span className='text-base font-medium text-gray-500'>Delivered</span>
                                </div>
                                <p className='text-lg font-semibold'><span className='font-semibold'>Payment:</span> <span className='text-base font-medium text-gray-500'>Cash on delivery</span></p>
                                <h1 className='text-xl font-bold'>Items:</h1>
                                {/* Product Details */}
                                <div className='flex flex-col gap-4'>
                                    {/* left side */}
                                    <img src={order.product.productImage} alt={order.product.productTitle} className='w-44 h-44 rounded-lg' />
                                    {/* right side */}
                                    <div className='flex flex-col gap-4 '>
                                        <h1 className='text-xl font-semibold'>{order.product.productTitle}</h1>
                                        <p className='text-gray-700'>${order.product.productPrice}</p>
                                        <p className='text-gray-700'>Quantity: {order.product.productQuantity}</p>
                                        <button
                                            onClick={() => navigate(`/product/${order.product.productId}`)}

                                            className="text-sm text-blue-500 hover:underline mt-2"
                                        >
                                            Write a Review
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </motion.div> :
                      <motion.div initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                          duration: 0.8,
                          delay: 0.5,
                          ease: [0, 0.71, 0.2, 1.01],
                      }} className='flex flex-col min-h-screen items-center justify-center'>
                        <h1 className='text-4xl font-bold my-4'>Orders</h1>
                      <img src="https://cdn-icons-png.flaticon.com/512/107/107831.png" alt="empty wishlist" className='w-44 h-44' />
                      <h1 className='text-2xl font-bold'>Your Order Page is Empty</h1>
                      <p className='text-gray-500'>Place order to see them here.</p>
                      <Link to={"/"} className='bg-yellow-400 px-4 py-2 rounded-full mt-4'>Browse Products</Link>
                  </motion.div>
            )}

        </div>
    )
}

export default Orders

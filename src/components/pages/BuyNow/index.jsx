import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../../firebase";
import { getDoc, updateDoc, doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CartContext from "../../../context/CartContext";
import { Plus, Minus, Loader } from 'lucide-react';
import MiniProductSkeleton from "../../skeletons/MiniProductSkeleton";
const BuyNow = () => {

  const { user, setuser } = useContext(CartContext)
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, setValue, formState: { errors }, setError, handleSubmit } = useForm();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [productId, setProductId] = useState(id);
  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please log in to place an order.");
      // Redirect to login page
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const orderRef = collection(db, "users", userId, "orders");
      // Create a new order document
      await addDoc(orderRef, {
        ...data,
        product: {
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          productPrice: product.price,
          productQuantity: quantity,

        },
        paymentMethod: "Cash on Delivery",
        createdAt: serverTimestamp(),
      });

      // Remove the product from the cart after placing the order
      const cartRef = doc(db, "users", user.uid);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const cartItems = cartData.cart || [];

        const updatedCartItems = cartItems.filter(item => Number(item.id) !== Number(product.id));

        await updateDoc(cartRef, {
          cart: updatedCartItems,
        });
      }
      setLoading(false);
      toast.success("Order placed successfully!");
      // Reset form fields    
      setValue("name", "");
      setValue("phone", "");
      setValue("address", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zip", "");
      setQuantity(1);
      // Redirect to orders page 
      navigate("/orders");
    } catch (error) {
      console.error("Order placement failed: ", error);
      setLoading(false);
      toast.error("Failed to place order. Please try again.");
    }
  };
  useEffect(() => {
    const fetchProductInCart = async () => {
      try {
        if (user) {
          const cartRef = doc(db, "users", user.uid);
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            const cartList = cartSnap.data().cart || [];
            const isAlreadyInCart = cartList.some((item) => Number(item.id) === Number(id));
            //checking if the item is already in cart
            if (isAlreadyInCart) {
              const cartItem = cartList.find((item) => Number(item.id) === Number(id));
              setProduct(cartItem);
              setQuantity(cartItem.quantity);
              setValue("quantity", cartItem.quantity || 1);
            }
            // If the item is not in cart, fetch product details
            else {
              fetch(`https://fakestoreapi.com/products/${id}`)
                .then((res) => res.json())
                .then((data) => setProduct(data));
              setValue("quantity", 1);
            }
          }
        }
      }
      catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
    fetchProductInCart();
  }, [user, id]);

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center gap-10 p-4 mt-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Buy Now</h2>

      {loading ? <MiniProductSkeleton /> : (
        <div className="flex gap-4 items-center border-b pb-4">
          <img src={product?.image} alt={product?.title} className="w-24 max-h-fit object-cover rounded" />
          <div>
            <h3 className="text-lg font-semibold">{product.title || "unknown"}</h3>
            <p className="text-red-600 font-bold text-xl">₹{product?.price || 0}</p>
          </div>
        </div>
      )}

      {/* Order Details */}
      <motion.div initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }} className="sm:p-8 p-4 bg-white border-2 my-2 rounded-2xl shadow-2xl sm:w-[80%] w-[100%] mx-auto  flex flex-col gap-4">
        {loading && <Loader />}
        <h2 className="text-2xl font-bold mb-6 text-center ">Order Details</h2>



        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          {/* Name field */}
          <div className="flex flex-col gap-1 name-field">
            <label htmlFor="name" className="font-medium">Name</label>
            <motion.input
              initial={{ scale: 0.9 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}

              id="name"
              placeholder="Enter your name"
              type="text"
              {...register("name", { required: { value: true, message: "Please enter name" }, })}
              className={`w-full px-4 py-2 border ${errors.email ? " focus:outline-none focus:ring-1 focus:ring-red-500" : "border-gray-300 ring-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                } rounded-lg `}
            />
            {errors.name && <span className="text-red-400 animate-pulse">{errors.name.message}</span>}
          </div>
          {/* Phone number */}
          <div className="flex flex-col gap-1 phone-field">
            <label htmlFor="phone" className="font-medium">Phone No </label>
            <motion.input
              initial={{ scale: 0.9 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}

              id="phone"
              placeholder="Enter your phone"
              type="Number"
              {...register("phone", { required: { value: true, message: "Please enter phone number" }, maxLength: { value: 10, message: "Phone must be 10 digit!" }, minLength: { value: 10, message: "Phone must be 10 digit!" }, })}
              className={`w-full px-4 py-2 border ${errors.email ? " focus:outline-none focus:ring-1 focus:ring-red-500" : "border-gray-300 ring-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                } rounded-lg `}
            />
            {errors.phone && <span className="text-red-400 animate-pulse">{errors.phone.message}</span>}
          </div>
          {/* Address Field */}
          <div className="flex flex-col gap-1 address-field">
            <label htmlFor="address" className="font-medium">Address</label>
            <motion.input
              initial={{ scale: 0.9 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
              id="address"
              placeholder="Enter your address"
              type="text"
              {...register("address", { required: { value: true, message: "Please enter address" } })}
              className={`w-full px-4 py-2 border ${errors.address ? "focus:ring-red-500" : "focus:ring-blue-500"} rounded-lg focus:outline-none focus:ring-2`}
            />
            {errors.address && <span className="text-red-400 animate-pulse">{errors.address.message}</span>}
          </div>

          {/* City Field */}
          <div className="flex flex-col gap-1 city-field">
            <label htmlFor="city" className="font-medium">City</label>
            <motion.input
              initial={{ scale: 0.9 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
              id="city"
              placeholder="Enter your city"
              type="text"
              {...register("city", { required: { value: true, message: "Please enter city" } })}
              className={`w-full px-4 py-2 border ${errors.city ? "focus:ring-red-500" : "focus:ring-blue-500"} rounded-lg focus:outline-none focus:ring-2`}
            />
            {errors.city && <span className="text-red-400 animate-pulse">{errors.city.message}</span>}
          </div>

          {/* State Field */}
          <div className="flex flex-col gap-1 state-field">
            <label htmlFor="state" className="font-medium">State</label>
            <motion.input
              initial={{ scale: 0.9 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
              id="state"
              placeholder="Enter your state"
              type="text"
              {...register("state", { required: { value: true, message: "Please enter state" } })}
              className={`w-full px-4 py-2 border ${errors.state ? "focus:ring-red-500" : "focus:ring-blue-500"} rounded-lg focus:outline-none focus:ring-2`}
            />
            {errors.state && <span className="text-red-400 animate-pulse">{errors.state.message}</span>}
          </div>

          {/* ZIP Code Field */}
          <div className="flex flex-col gap-1 zip-field">
            <label htmlFor="zip" className="font-medium">ZIP Code</label>
            <motion.input
              initial={{ scale: 0.9 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
              id="zip"
              placeholder="Enter ZIP code"
              type="number"
              {...register("zip", {
                required: { value: true, message: "Please enter ZIP code" },
                minLength: { value: 5, message: "ZIP must be 5 digits" },
                maxLength: { value: 6, message: "ZIP must be 6 digits max" },
              })}
              className={`w-full px-4 py-2 border ${errors.zip ? "focus:ring-red-500" : "focus:ring-blue-500"} rounded-lg focus:outline-none focus:ring-2`}
            />
            {errors.zip && <span className="text-red-400 animate-pulse">{errors.zip.message}</span>}
          </div>


          {/* Quantity Field */}
          <div className="flex flex-col gap-1 quantity-field">
            <label htmlFor="quantity" className="font-medium">Quantity</label>
            <motion.input
              initial={{ scale: 0.9 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.8 }}
              id="quantity"
              type="number"
              min={1}

              {...register("quantity", {
                required: { value: true, message: "Please enter quantity" },
                min: { value: 1, message: "Minimum quantity is 1" },
              })}
              className={`w-full px-4 py-2 border ${errors.quantity ? "focus:ring-red-500" : "focus:ring-blue-500"
                } border-gray-300 rounded-lg focus:outline-none focus:ring-2`}
            />
            {errors.quantity && (
              <span className="text-red-400 animate-pulse">{errors.quantity.message}</span>
            )}
          </div>


          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              } text-white px-6 py-2 rounded-xl w-full`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </motion.button>
        </form>
        {/* Summary Section */}
        <div className="border-t pt-4 mt-6">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <p>Price per item: ₹{product?.price || 0}</p>
          <p>Quantity: {quantity}</p>
          <p className="font-bold text-lg mt-2">Total: ₹{product?.price * quantity}</p>
          <p className="font-bold text-lg mt-2">Payment : Cash on delivery</p>
        </div>

      </motion.div >

    </div>
  );
};

export default BuyNow;

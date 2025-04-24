import { useState, useEffect, useContext } from "react";
import { MdOutlineRateReview } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, Bounce } from "react-toastify";
import CartContext from "../../../context/CartContext";
import { db ,auth} from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc, serverTimestamp } from "firebase/firestore";
const Reviews = ({ product }) => {
  const { user,setuser } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, username: "John", text: "Great product! Highly recommend. 👍", rating: 5 },
    { id: 2, username: "Nick", text: "Fast shipping and excellent quality. 🚀", rating: 4 },
    { id: 3, username: "Jeff", text: "Customer support was very helpful. 😊", rating: 5 },
  ]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [userReviews, setuserReviews] = useState([])
  const navigate = useNavigate();
  const [refreshReviews, setRefreshReviews] = useState(true);
  const [isUserSelectedRating, setisUserSelectedRating] = useState(true)



  const addReview = async () => {
    if (newReview.trim() === "" || rating === 0) 
      {
        setisUserSelectedRating(false)
        return;
      }
     

    try {
      setLoading(true)
      setisUserSelectedRating(true)
      if (user) {
        const reviewRef = doc(db, "products", String(product.id), "reviews", user.uid);
        const reviewSnap = await getDoc(reviewRef);
        const reviewData = {
          username: user.displayName || "Anonymous",
          text: newReview,
          productRating: rating,
          productId: product.id,
          createdAt: serverTimestamp()
        };
        const orderRef = collection(db, "users", user.uid, "orders")
        const orderSnap = await getDocs(orderRef);
        

        const orders = orderSnap.docs.map((doc) => (
          {
            orderId: doc.id,
            ...doc.data()
          }
        ))
        const isProductPurchased  = orders.some((order)=> order.product.productId === Number(product.id))
       // Check if the product is purchased by the user
        if(isProductPurchased)
       {
        // If the review already exists, update it
        if (reviewSnap.exists()) {
          await updateDoc(reviewRef, reviewData);
          toast.success("Review updated successfully!")
          setNewReview("");
          setRating(0);
          setRefreshReviews(prev => !prev);

          return
        }
        // If the review doesn't exist, create a new one
        else {
          await setDoc(reviewRef, reviewData);
          setNewReview("");
          setRating(0);
          toast.success("Review added successfully!")
          setRefreshReviews(prev => !prev);

          return
        }
        return
       }
       // If the product is not purchased
       else{
        toast.error("You must purchase the product to review it")
        setNewReview("");
        setRating(0);
        return
       }


      }
      else {
        navigate("/signin")
        toast.error("Please login to add a review")
      }
    }
    catch (error) {
      toast.error("Error adding review")
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   if(rating > 0 && rating <= 5)
   {
    setisUserSelectedRating(true)
   }
    // else{
    //   setisUserSelectedRating(true)
    // }
  }, [rating])

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setuser(currentUser);
  
      if (!currentUser) {
        toast.error("Please sign in to write a review");
        navigate("/signin");
        return;
      }
  
      const fetchReviews = async () => {
        try {
          const reviewsRef = collection(db, "products", String(product.id), "reviews");
          const reviewSnap = await getDocs(reviewsRef);
          const allReviews = reviewSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setuserReviews(allReviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          toast.error("Error loading reviews.");
        }
      };
  
      fetchReviews();
    });
  
    return () => unsubscribe(); // cleanup the listener
  }, [product.id, refreshReviews, navigate]);
  
  return (
    <div className="reviewsBox w-full mx-auto py-4 px-2">
      {/* Add Review Input & Button */}
      <div className="add_review flex gap-10 flex-wrap w-full items-center">
        <motion.input
          type="text"
          placeholder="Write Your Review"
          className="min-w-[80%] border border-gray-300 focus:border-orange-400 outline-none py-4 px-4"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          initial={{ scale: 1 }}
          whileFocus={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255,165,0,0.5)" }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          className="text-orange-400 text-3xl"
          onClick={addReview}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <MdOutlineRateReview />
        </motion.button>
      </div>
      <div className="flex gap-1 my-2">
        {/* Star Rating Selection */}
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer text-xl ${star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      {!isUserSelectedRating && <p className="text-sm text-gray-500">Please select a rating</p>}
      {userReviews?.length > 0 ?

        (<>
          {/* User Reviews */}
          {/* Reviews List */}
          <div

            className="mt-4 space-y-3 cursor-pointer">
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <motion.div
                  key={review.id}
                  whileHover={{ scale: 1.0 }}
                  initial={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="border border-gray-200 p-3 rounded-lg shadow-sm"
                >
                  <div className="flex gap-2 p-2">
                    <img className="w-5 h-5 rounded-full border" src={"https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"} />
                    <h1 className="text-b text-wrap">{review.username}</h1>
                  </div>
                  <div

                    className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${i < review.productRating ? "text-yellow-500" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-wrap">Reviewed On {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : "Just now"}</p>
                  <p className="text-black text-wrap">{review.text}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div></>) :

        (<>

          {/* Reviews List */}
          <div

            className="mt-4 space-y-3 cursor-pointer">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div
                  key={review.id}
                  whileHover={{ scale: 1.0 }}
                  initial={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="border border-gray-200 p-3 rounded-lg shadow-sm"
                >
                  <h1 className="text-gray-400 text-wrap">{review.username}</h1>
                  <div

                    className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${i < review.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-wrap">{review.text}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div></>)}
    </div>
  );
};

export default Reviews;

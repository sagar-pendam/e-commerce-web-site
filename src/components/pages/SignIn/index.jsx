import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../../../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import  Loader  from "../../common/Loader";
import { ToastContainer, Bounce, toast } from 'react-toastify';
import { collection, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc, serverTimestamp  } from "firebase/firestore";
import { Eye, EyeOff } from 'lucide-react';
import { motion } from "framer-motion";
const SignIn = () => {

  const navigate = useNavigate();
  const [loading, setloading] = useState(false)
  const { register, formState: { errors }, setError, handleSubmit } = useForm();
  const [showPassword, setshowPassword] = useState(true)

  const onSubmit = async (data) => {
    try {
      setloading(true)
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user

      setloading(false)
      toast.success("Logged in successfully!");
      // Check if Firestore doc exists, create if not
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          wishlist: [],
          cart: [],
          orders: [],

        });
      }
      navigate("/");
    } catch (error) {
      setloading(false);

      if (error.code === "auth/operation-not-allowed") {
        setError("password", {
          type: "manual",
          message: "Incorrect password.",
        });
      } else if (error.code === "auth/user-not-found") {
        setError("email", { type: "manual", message: "No account found with this email." });
      } else if (error.code === "auth/too-many-requests") {
        setError("email", { type: "manual", message: "Too many attempts. Try again later." });
      } else {
        setError("email", { type: "manual", message: "Login failed. Please try again." });
      }
      console.log(error);
      


    }



  }

  const googleLoginButton = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user


     
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
 // Check if Firestore doc exists, create if not
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          wishlist: [],
          cart: [],
          createdAt: serverTimestamp(), 
      });
      
      }
      navigate("/");

    }
    catch (error) {
      console.error(error)



    }
  }
  useEffect(() => {
    if (errors.email) {
      document.querySelector("input[name='email']")?.focus();
    } else if (errors.password) {
      document.querySelector("input[name='password']")?.focus();
    }
  }, [errors]);
  return (
    <div className="flex items-center px-4 justify-center min-h-screen bg-[#6b3aff]">

      <motion.div  initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }} className="p-8 bg-[#6b3aff] rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4">
        {loading && <Loader />}
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <button
          type="button"
          onClick={googleLoginButton}
          className="flex bg-[#00153c] text-white font-semibold gap-2 items-center justify-center px-4 py-2 rounded-lg  mx-auto cursor-pointer hover:bg-white hover:text-slate-800 hover:border-slate-700 border-2 transition-all duration-300"
        >
          Google <img src="./google.png" className="w-4 h-4" alt="" />
        </button>

        <div className="flex items-center justify-center">
          <span className="text-white text-sm">OR</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <motion.input
           initial={{ scale: 0.9 }}
           whileFocus={{ scale: 1 }}
           transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
            name="email"
            type="email"
            placeholder="Email"
            {...register("email", { required: { value: true, message: "Please enter email" }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
            className={`w-full px-4 py-2 border ${errors.email ? " focus:outline-none focus:ring-1 focus:ring-red-500" : "border-gray-300 ring-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              } rounded-lg `}
          />
          {errors.email && <span className="text-red-400 animate-pulse">{errors.email.message}</span>}
  <div className="flex flex-col gap-2 relative">
                        {/* Password Input */}
                        <motion.input
                            initial={{ scale: 0.9 }}
                            whileFocus={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                duration: 0.8,
                                ease: [0, 0.71, 0.2, 1.01],
                            }}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Please enter password",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                    message:
                                        "Password must be 8+ characters, include uppercase, lowercase, number & special character",
                                },
                            })}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* Toggle Visibility Button */}
                        <button
                            type="button"
                            onClick={() => setshowPassword(!showPassword)}
                            className="absolute right-6 top-5 transform -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-all duration-300"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>

                        {/* Error Message */}
                        {errors.password && (
                            <span className="text-red-400 animate-pulse">
                                {errors.password.message}
                            </span>
                        )}
                    </div>


          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#00153c] hover:bg-[#223b68] text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign In
          </motion.button>
        </form>
        {/* Sign Up and Forgot password Links */}
        <div className="flex flex-col items-center gap-4" >
          <Link className="text-[#07003D] underline font-bold text-sm  cursor-pointer hover:text-[#28215D]" to={"/forgot-password"}> Forgot password ?</Link>

          <div className="flex gap-2 items-center">
            <p className="text-sm font-semibold text-white">New User ?</p>
            <Link className="text-[#07003D] underline font-bold text-sm  cursor-pointer hover:text-[#28215D]" to={"/signup"}> Sign up</Link>
          </div>
        </div>
      </motion.div >
    </div>

  );
};

export default SignIn;
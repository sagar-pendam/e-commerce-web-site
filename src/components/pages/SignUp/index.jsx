import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from 'lucide-react';
import Loader from "../../common/Loader"
import { toast } from "react-toastify";
import { collection, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc,serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setloading] = useState(false)
    const { register, formState: { errors, isSubmitting }, setError, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [showPassword, setshowPassword] = useState(false)

    const onSubmit = async (data) => {

        try {
            setloading(true)
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            setloading(false)
            toast.success("Account created successfully!");
            // Check if Firestore doc exists, create if not
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    wishlist: [],
                    cart: [],
                    createdAt: serverTimestamp(), 
                });
                
            }
            navigate("/");
        } catch (error) {
            setloading(false)
            toast.error("Signup failed. " + error.message);
            if (error.code === "auth/email-already-in-use") {

                setError("email", { type: "manual", message: "This email is already registered. Please log in" })
            }
            else {
                console.log(error);

                setError("email", { type: "manual", message: "Invalid username or password!" })
            }

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
        <div className="flex items-center justify-center min-h-screen bg-[#6b3aff] px-2">
            <motion.div initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }} className=" p-8 bg-[#6b3aff] rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4">
                {loading && <Loader />}
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <motion.input
                        initial={{ scale: 0.9 }}
                        whileFocus={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
                        name="email"
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: { value: true, message: "Please enter email" }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}

                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email && <span className="text-red-400 animate-pulse">{errors.email.message}</span>}
                    {/* <div className="flex flex-col gap-2 relative">
                        <motion.input
                         initial={{ scale: 0.9 }}
                         whileFocus={{scale:1}}
                         transition={{type: "spring",stiffness:300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password", {
                                required: { value: true, message: "Please enter password" },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                    message:
                                        "Password must be 8+ characters, include uppercase, lowercase, number & special character",
                                }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="button" onClick={() => { setshowPassword(!showPassword) }} className="text-sm cursor-pointer hover:text-gray-400 transition-all duration-300 absolute z-40 right-2 top-3"> {showPassword ? <EyeOff className="w-4 h-4 " /> : <Eye className="w-4 h-4 " />}</button>
                        {errors.password && <span className="text-red-400 animate-pulse">{errors.password.message}</span>}
                    </div> */}
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
                        Sign Up
                    </motion.button>
                </form>

                <div className="flex gap-2 items-center flex-wrap py-4">
                    <p className="text-sm text-white">Already have an account ?</p>
                    <Link to={"/signin"} className="text-[#07003D] underline font-bold text-sm  cursor-pointer hover:text-[#28215D]">Log In</Link>
                </div>
            </motion.div>
        </div>

    );
};

export default SignUp;
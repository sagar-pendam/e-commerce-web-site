import React,{useState} from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase"
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, Bounce, toast } from 'react-toastify';
import { motion } from "framer-motion";
function ForgotPassword() {
    const [loading, setLoading] = useState(false);

    const { register, formState: { errors, isSubmitted, isSubmitSuccessful }, setError, handleSubmit } = useForm();

    const handlePasswordReset = async (email) => {

    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, data.email)
            setLoading(false);
          
            toast.info("Password reset email sent!")
        }
        catch (error) {
            setError("email", { type: "manual", message: "Error sending password reset email" })
            console.error("Error sending password reset email:", error.message);
           

        }
    }
    return (
        <div className="flex bg-[#6b3aff] items-center justify-center min-h-screen ">
            {isSubmitSuccessful ? <div className="bg-[#6b3aff] p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4">
                <div className="flex  flex-col gap-2 items-center justify-center">
                    <h2 className="text-2xl font-bold  text-center text-white">Check your inbox</h2>
                    <p className='text-white text-sm text-wrap text-center'>
                        An email with a link to reset your password was sent to the email address associated with your account.
                    </p>

                </div>
                <Link className="text-white text-sm  cursor-pointer underline hover:text-gray-200" to={"/forgot-password"}> Resend</Link>

            </div> :
                <motion.div  initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }} className="bg-[#6b3aff] p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4">
                    <div className="flex  flex-col gap-2 items-center justify-center">
                        <h2 className="text-2xl font-bold  text-center text-white">Reset your password</h2>
                        <p className='text-white text-sm text-wrap text-center'>Enter your email address or username and we’ll send you a link to reset your password</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <motion.input
                         initial={{ scale: 0.9 }}
                         whileFocus={{ scale: 1 }}
                         transition={{ type: "spring", stiffness: 300, duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
                        name='email'
                            type="email"
                            placeholder="Email"
                            {...register("email", { required: { value: true, message: "Please enter email" }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <span className="text-[#D52424] font-bold animate-pulse">{errors.email.message}</span>}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={loading}
                            type="submit"
                            className="w-full bg-[#00153c] hover:bg-[#223b68] text-white font-semibold py-2 rounded-lg transition duration-300"
                        >
                            {loading ? "Sending..." : "Reset Password"}
                        </motion.button>
                    </form>



                </motion.div>}
        </div>
    )
}

export default ForgotPassword
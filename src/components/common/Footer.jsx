import React from 'react'
import { CiFacebook } from "react-icons/ci";
import { FaRegCopyright, FaInstagram , FaStar} from "react-icons/fa";
import { FaXTwitter, FaFacebook } from "react-icons/fa6";
import { Link } from "react-router-dom";
function Footer() {
    return (
        <>
            {/* Footer Section */}
            <footer className='bg-slate-800  w-full py-10'>
                <div className='flex flex-col items-center justify-center gap-4'>
                    {/* Contact Details */}
                    <div className='contact flex gap-4 text-white items-center justify-center text-sm'>
                        <div>
                            <h1>Contact With Us</h1>
                        </div>
                        <div className='icons flex gap-4'>
                            <FaFacebook />
                            <FaXTwitter />
                            <FaInstagram />
                        </div>
                    </div>
                    {/* Copyright & Policy Details */}
                    <div className='cpd flex flex-col gap-3'>
                        <div className='cpd1 flex items-center flex-wrap justify-center gap-4 text-sm'>
                            <Link className='text-white hover:text-gray-200 hover:underline' to={"/conditions"}>Conditions of Use & Sale</Link>
                            <Link className='text-white hover:text-gray-200 hover:underline' to={"/privacy"}>Privacy Notice</Link>
                            
                        </div>
                        <div className='cpd2 flex text-white items-center justify-center text-sm'>
                            <FaRegCopyright />
                            <h1>1996-2025, Amazon.com, Inc. or its affiliates</h1>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer

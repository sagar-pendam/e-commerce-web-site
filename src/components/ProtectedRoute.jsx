import React,{useState,} from 'react'
import  CartContext  from '../context/CartContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import CircleLoader from './common/CircleLoader';
function ProtectedRoute({children}) {
    const {user,authLoading} = useContext(CartContext);
    if (authLoading) {
        return <div className="text-center py-10 flex items-center h-screen w-full justify-center">Please Wait... <CircleLoader/></div>; 
      }
    
      if (!user) {
        return <Navigate to="/signin" />;
      }
    
      return children;
    
}

export default ProtectedRoute

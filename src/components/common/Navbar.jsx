import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import CartContext from "../../context/CartContext";
import { LogIn, ShoppingBag, House, Heart, LogOut,ShoppingCart } from 'lucide-react';
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
function Navbar() {
  const { category, user, setuser } = useContext(CartContext);
  const [searchedResult, setsearchedResult] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userSearch, setuserSearch] = useState(""); // Store search bar values
  const [searchPerformed, setSearchPerformed] = useState(false); // Track if search is done
  const navigate = useNavigate();


  const handleChange = (e) => {
    const searchValue = e.target.value;
    setuserSearch(searchValue);
    setSearchPerformed(true); // User is searching

    if (searchValue.trim() === "") {
      setsearchedResult([]); // Reset search results if input is empty
      return;
    }

    // Filter category based on the search input
    const filteredResults = category.filter((item) =>
      item.toLowerCase().includes(searchValue.toLowerCase())
    );
    setsearchedResult(filteredResults);
  };

  //Handling search
  const handleSearch = () => {
    console.log("Searching for:", userSearch);
    if (searchedResult.length === 0) {
      setSearchPerformed(false);
      console.log("No products matched.");
    }
    else if (userSearch.trim() != "" && searchedResult.length > 0) {
      setSearchPerformed(false);
      navigate(`/product-list/${searchedResult[0]}`);
    }
    else {
      setSearchPerformed(false);
      navigate(`/product-list/${userSearch}`);
    }
    setuserSearch(""); // Clear the search input after performing the search
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  //Handling sign out
  const handleLogOutUser = () => {
    signOut(auth).then(() => {

      setuser(null)
      toast.success("Logged out successfully!");
      if (location.pathname !== "/") {
        navigate("/")
      }
    }).catch((error) => {

      toast.error("Logout failed. " + error.message);
      console.error("Logout failed. ", error.message);

    });

  }
  return (
    <nav className="bg-[#0F172A] sticky top-0 z-50 shadow-md px-2 xl:py-2 flex items-center justify-center ">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-4 py-2">
        {/* Logo */}
        <NavLink to="/" className="text-2xl flex gap-2 items-center justify-center font-bold text-white">
         <ShoppingCart className="text-[#44ff77]" /> <span>ShopCart</span>
        </NavLink>
        {/* Destop menu bar */}
        <div className="hidden xl:flex items-center gap-6">
          {/* Category NavLinks */}
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white rounded-full shadow-sm w-80 relative">
            <button className="bg-red-400 p-2 rounded-l-full" onClick={handleSearch}>
              <img src="/svg/search.svg" alt="Search" className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Search for products"
              className="outline-none w-full px-2 py-1 rounded-r-full text-gray-700"
              value={userSearch}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            />

            {/* Search Suggestions */}
            {searchPerformed && (
              <div
                className={`absolute top-10 border w-full p-6 z-50 bg-white ${userSearch.length === 0 ? "hidden" : ""
                  }`}
              >
                {searchedResult.length === 0 ? (
                  <div className="text-black">No products matched.</div>
                ) : (
                  <ul className="flex flex-col gap-4 items-start justify-center">
                    {searchedResult.map((item) => (
                      <NavLink
                        key={item}
                        onClick={() => setSearchPerformed(false)}
                        className="hover:bg-green-400 w-full px-2 font-semibold"
                        to={`/product-list/${item}`}
                      >
                        {item}
                      </NavLink>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <ul className="flex flex-wrap gap-4 items-center">

            {/* Home */}
            <li>
              <NavLink to="/" className={({ isActive }) =>
                `text-bs rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
              }>
                <House className="w-4 h-4" /> Home
              </NavLink>
            </li>

            {user && <>
              {/* Cart */}
              <li>
                <NavLink to="/cart" className={({ isActive }) =>
                  `text-bs rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
                }>
                  <IoCartOutline className="w-4 h-4" /> Cart
                </NavLink>
              </li>

              {/* Orders */}
              <li>
                <NavLink to="/orders" className={({ isActive }) =>
                  `text-bs rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
                }>
                  <ShoppingBag className="w-4 h-4" /> Orders
                </NavLink>
              </li>
              {/* Wishlist */}
              <li>
                <NavLink to="/wishlist" className={({ isActive }) =>
                  `text-sm rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
                }>
                  <Heart className="w-4 h-4 fill-red-400 " /> Wishlist
                </NavLink>
              </li>
            </>}
            {/* Sign In */}
            {!user && <li>
              <NavLink to="/signin" className={({ isActive }) =>
                `text-sm font-semibold rounded-full px-4 py-2 flex gap-2 items-center justify-center shadow-md transition-all duration-500 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
              }>
                <LogIn className="w-4 h-4" /> Sign In
              </NavLink>
            </li>}

            {/* Sign Up */}
            {!user &&
              <li>
                <NavLink to="/signup" className={({ isActive }) =>
                  `text-sm font-semibold rounded-full px-4 py-2 flex gap-2 items-center justify-center shadow-md transition-all duration-500 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
                }>
                  <LogIn className="w-4 h-4" /> Sign Up
                </NavLink>
              </li>}
            {/* Log out */}
            {user &&
              <li>
                <button onClick={handleLogOutUser} className={`text-sm bg-red-400 text-white cursor-pointer hover:text-gray-500 hover:bg-[#71F8A5] font-semibold rounded-full px-4 py-2 flex gap-2 items-center justify-center shadow-md transition-all duration-500 `}>
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </li>}

            


          </ul>
          {/* User Profile */}
          {user && <div className="flex items-center gap-2">
            {user.photoURL && (
              <img src={user.photoURL || "profile.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm font-medium text-white">{user.displayName || user.email}</span>
          </div>}
        </div>

        {/* Menu Button (Mobile Toggle) */}
        <button className="xl:hidden text-white transition-all duration-500 text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Menu */}

        <div className={`flex xl:hidden flex-col w-full items-center gap-6 ${isOpen ? " max-h-96 overflow-y-auto" : "max-h-0 overflow-hidden"} transition-all duration-500 `}>

          {/* Search Bar */}
          <div className="flex xl:hidden items-center bg-white rounded-full shadow-sm max-w-80 relative">
            <button className="bg-red-400 p-2 rounded-l-full" onClick={handleSearch}>
              <img src="/svg/search.svg" alt="Search" className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Search for products"
              className="outline-none w-full px-2 py-1 rounded-r-full text-gray-700"
              value={userSearch}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            />

            {/* Search Suggestions */}
            {searchPerformed && (
              <div
                className={`absolute top-10 border w-full p-6 z-50 bg-white ${userSearch.length === 0 ? "hidden" : ""
                  }`}
              >
                {searchedResult.length === 0 ? (
                  <div className="text-black">No products matched.</div>
                ) : (
                  <ul className="flex flex-col gap-4 items-start justify-center">
                    {searchedResult.map((item) => (
                      <NavLink
                        key={item}
                        onClick={() => setSearchPerformed(false)}
                        className="hover:bg-green-400 w-full px-2 font-semibold"
                        to={`/product-list/${item}`}
                      >
                        {item}
                      </NavLink>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <ul className="flex flex-wrap gap-4 items-center">

{/* Home */}
<li>
  <NavLink to="/" className={({ isActive }) =>
    `text-bs rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
  }>
    <House className="w-4 h-4" /> Home
  </NavLink>
</li>

{user && <>
  {/* Cart */}
  <li>
    <NavLink to="/cart" className={({ isActive }) =>
      `text-bs rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
    }>
      <IoCartOutline className="w-4 h-4" /> Cart
    </NavLink>
  </li>

  {/* Orders */}
  <li>
    <NavLink to="/orders" className={({ isActive }) =>
      `text-bs rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
    }>
      <ShoppingBag className="w-4 h-4" /> Orders
    </NavLink>
  </li>
  {/* Wishlist */}
  <li>
    <NavLink to="/wishlist" className={({ isActive }) =>
      `text-sm rounded-full px-4 py-2 underline transition-all duration-500 font-semibold flex items-center gap-2 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
    }>
      <Heart className="w-4 h-4 fill-red-400 " /> Wishlist
    </NavLink>
  </li>
</>}
{/* Sign In */}
{!user && <li>
  <NavLink to="/signin" className={({ isActive }) =>
    `text-sm font-semibold rounded-full px-4 py-2 flex gap-2 items-center justify-center shadow-md transition-all duration-500 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
  }>
    <LogIn className="w-4 h-4" /> Sign In
  </NavLink>
</li>}

{/* Sign Up */}
{!user &&
  <li>
    <NavLink to="/signup" className={({ isActive }) =>
      `text-sm font-semibold rounded-full px-4 py-2 flex gap-2 items-center justify-center shadow-md transition-all duration-500 ${isActive ? 'bg-[#71F8A5] text-white' : 'bg-red-400 text-white hover:bg-[#71F8A5] hover:text-gray-500'}`
    }>
      <LogIn className="w-4 h-4" /> Sign Up
    </NavLink>
  </li>}
{/* Log out */}
{user &&
  <li>
    <button onClick={handleLogOutUser} className={`text-sm bg-red-400 text-white cursor-pointer hover:text-gray-500 hover:bg-[#71F8A5] font-semibold rounded-full px-4 py-2 flex gap-2 items-center justify-center shadow-md transition-all duration-500 `}>
      <LogOut className="w-4 h-4" /> Log Out
    </button>
  </li>}

{/* Inside your Burger/Drawer menu */}


</ul>
{/* User Profile */}
{user && <div className="flex items-center gap-2 w-full p-4">
{user.photoURL && (
  <img src={user.photoURL || "profile.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
)}
<span className="text-sm font-medium text-white">{user.displayName || user.email}</span>
</div>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

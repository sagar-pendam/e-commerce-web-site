
import React, { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons
import CartContext from '../../context/CartContext';
import { IoFilterOutline } from "react-icons/io5";
function Filter() {
  const { priceApplied, setpriceApplied, minPrice, setminPrice, maxPrice, setmaxPrice, priceRange, setPriceRange, category, setcategory, products, setProducts, originalPriceRange, setoriginalPriceRange } = useContext(CartContext)
  const [isFilterOpen, setisFilterOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [originalProducts, setorignalProducts] = useState([])
  

  const handleFilter = () => {
    setProducts(products.filter((item) => ((item.price >= priceRange) && (item.price <= maxPrice))));    
    setpriceApplied(!priceApplied)    
  };

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]

    );   

  };
  //Filter button handler
  const showFilter = (value) => {

    setisFilterOpen(!isFilterOpen)
  }


  useEffect(() => {
    if (selectedCategories.length === 0) {
      setProducts(originalProducts); // Reset to all products if no categories are selected
    } else {
      setProducts(originalProducts.filter((item) => selectedCategories.includes(item.category)));
    }
  }, [selectedCategories, originalProducts]);

  // Fetch products from API
  useEffect(() => {

    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        // setting products max and min price
        let prices = []
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          prices.push(element.price)
        }
        
        let maxPrice1 = Math.max(...prices)
        let minPrice1 = Math.min(...prices)
       
        setmaxPrice(maxPrice1)
        setminPrice(minPrice1)
        setPriceRange(minPrice1)
        setorignalProducts(data)


      });


  }, []);
  return (
    <nav className='flex  md:gap-4 px-4  bg-slate-700 py-4 relative '>
      {/* Filter button */}
      {/* <button><img className="invert w-[25px]" onClick={()=>{showFilter(false)}} src='./svg/filter1.svg' /></button> */}
      <button className='invert' onClick={() => { showFilter(false) }}><IoFilterOutline /></button>

      {/* Filter Menu */}
      <nav className={isFilterOpen
        ? "bg-slate-900 absolute rounded-lg h-screen flex flex-col justify-center items-center gap-10 py-10 sm:w-96 w-[100%] z-50 text-white left-0  top-16 transition-all duration-500"
        : "bg-slate-900 absolute h-screen w-0 z-50 text-white left-0 rounded-lg top-16 transition-all duration-500"}>
        <button className='absolute top-4 right-4' onClick={() => { showFilter(false) }}><FiX /></button>  
        {/* Filter Products */}
        <div className={isFilterOpen
          ? "max-w-[80%] mx-auto px-10  shadow-md rounded-lg bg-slate-900 py-6 border-white border  transition-all duration-500"
          : "w-0 overflow-hidden  mx-auto shadow-md bg-slate-900 border-white  rounded-lg transition-all duration-500"}>

          <h2 className="text-lg font-semibold mb-3 text-white">Select Product Categories</h2>
          <div className="space-y-2 ">
            {category.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                />
                <span className="text-white">{category}</span>
              </label>


            ))}


          </div>
        </div>

        {/* Price Range */}
        <div className={isFilterOpen ? "flex flex-col space-y-3 p-4 border rounded-lg shadow-md max-w-[80%] w-80" : " hidden border rounded-lg shadow-md w-0"}>
          <label className="text-white font-medium ">Select Price Range:</label>

          <div className="flex justify-between text-sm  text-white">

            <span>${priceRange}</span>
            <span>${maxPrice}</span>
          </div>

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="10"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full cursor-pointer accent-blue-600"
          />

          <button
            onClick={handleFilter}
            className={isFilterOpen ? "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" : "w-0"}
          >
            Apply Filter
          </button>
        </div>

      </nav>
    </nav>

  )
}

export default Filter

import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { myCartItems } from "../api"; // ✅ import API

const Card = ({ products }) => {
  const [cartData, setCartData] = useState([]);
  const uri = import.meta.env.VITE_IMAGE;

  // ✅ Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await myCartItems();
      if (response.data.code === 200) {
        setCartData(response.data.data?.cartItems || []);
      } else {
        setCartData([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartData([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Helper to check if product already in cart
  const isInCart = (productId) =>
    cartData.some((item) => item.product.id === productId);

  return (
    <div
      className="grid gap-6 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6 
        place-items-center"
    >
      {products.map((data) => (
        <div
          key={data.id}
          className="flex flex-col group w-full max-w-[220px] sm:max-w-[240px] md:max-w-[260px] 
            outline outline-gray-300 rounded p-3 mb-5 
            transition duration-300 hover:shadow-lg hover:scale-105 bg-white"
        >
          {/* Top badge + wishlist/eye */}
          <div className="flex justify-between items-center text-xs">
            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded">
              -{Math.floor((100 / (data.price + 100)) * 100)} %
            </span>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Heart className="w-4 h-4" />
              <Eye className="w-4 h-4" />
            </div>
          </div>

          {/* Product Image */}
          <Link
            to={`/product/${data.name}/${data.id}`}
            className="flex flex-col"
          >
            <div className="flex items-center justify-center h-[140px] sm:h-[160px]">
              <img
                src={`${uri}/${data.imageUrl}`}
                alt={data.name}
                className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] object-cover rounded bg-gray-50"
              />
            </div>

            {/* Title */}
            <p className="text-sm sm:text-base font-medium mt-2 leading-tight h-[40px] line-clamp-2">
              {data.name}
            </p>

            {/* Price + Reviews */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-orange-600">Rs: {data.price}</span>
                <span className="line-through text-gray-500">
                  Rs: {data.price + 100}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <p className="text-gray-600">({data.reviewCount})</p>
              </div>
            </div>
          </Link>

          {/* Add to cart button */}
          <button
            type="button"
            className="flex justify-between items-center w-full 
              bg-[#413232] text-white text-xs sm:text-sm px-4 py-2.5 mt-3 rounded 
              transition hover:bg-[#121212] disabled:bg-gray-200 disabled:text-gray-500"
            disabled={isInCart(data.id)}
          >
            {isInCart(data.id) ? (
              <span className="text-green-500">Added</span>
            ) : (
              <span>Add To Cart</span>
            )}
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Card;

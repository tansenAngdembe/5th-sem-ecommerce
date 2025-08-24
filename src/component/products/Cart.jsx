import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { myCartItems, removeCartItems } from "../../api";
import { toast } from "react-toastify";

const Cart = () => {
  const uri = import.meta.env.VITE_IMAGE;
  const [cartData, setCartData] = useState([]);

  const fetchCart = async () => {
    const response = await myCartItems();
    if (response.data.code === 200) {
      setCartData(response.data.data?.cartItems);
    } else {
      setCartData([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

 const removeItem = async (id) => {
  try {
    const removeRes = await removeCartItems(id);
    if (removeRes.data.code === 200) {
      toast.success(removeRes.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      // Refresh cart after successful removal
      fetchCart();
    }
  } catch (error) {
    console.error("Failed to remove item:", error);
    toast.error("Failed to remove item from cart.", {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
    });
  }
};

  // Calculate subtotal
  const subtotal = cartData.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shippingCost = subtotal > 0 ? 100 : 0; // example fixed shipping

  return (
    <div>
      {cartData.length !== 0 ? (
        <div className="p-6 max-w-4xl mx-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Product</th>
                <th className="p-2">Price</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartData.map((item) => (
                <tr key={item.product.id} className="border-b border-gray-300">
                  <td className="p-2 flex items-center gap-2">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 cursor-pointer"
                    >
                      ❌
                    </button>
                    <Link
                      to={`/product/${item.product.name}/${item.product.id}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={`${uri}${item.product.imageUrl}`}
                        alt={item.product.name}
                        className="w-12 h-12"
                      />
                      {item.product.name}
                    </Link>
                  </td>
                  <td className="p-2">Rs.{item.product.price}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">
                    Rs.{Math.floor(item.product.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button className="border px-4 py-2">
              <Link to="/">Return To Shop</Link>
            </button>
            <button className="border px-4 py-2">Update Cart</button>
          </div>

          <div className="flex w-full gap-2">
            <div className="flex mt-4 gap-2 w-[60%] h-10">
              <input
                type="text"
                placeholder="Coupon Code"
                className="border p-2 flex-1"
              />
              <button className="bg-red-500 text-white px-4 py-2">
                Apply Coupon
              </button>
            </div>

            <div className="border p-4 mt-6 w-[40%] ml-auto">
              <h2 className="text-lg font-semibold">Cart Total</h2>
              <div className="flex justify-between mt-2">
                <span>Subtotal:</span>
                <span>Rs.{subtotal}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Shipping:</span>
                <span>Rs.{shippingCost}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2 border-t pt-2">
                <span>Total:</span>
                <span>Rs.{subtotal + shippingCost}</span>
              </div>
              <Link to="/checkout" className="bg-red-500 text-white w-full py-2 mt-4 cursor-pointer">
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-98 w-full place-items-center justify-center">
          <div className="text-4xl">Your cart is empty</div>
          <div className="text-3xl bg-amber-600 p-4 rounded-2xl border-amber-200">
            <Link to="/">Shop now</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

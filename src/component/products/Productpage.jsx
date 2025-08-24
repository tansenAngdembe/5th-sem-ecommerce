import { useEffect, useState } from "react";
import { HeartIcon, TruckIcon, Undo2 } from "lucide-react";
import { Provider } from "../../context/contextProvider";
import { useParams } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import axios from "axios";
import { addToCart } from "../../api";

const uri = import.meta.env.VITE_IMAGE;
const uri_api = import.meta.env.VITE_URL;

export default function Productpage() {
  const { id } = useParams();
  const { state, successCart } = Provider();
  const [quantity, setQuantity] = useState(1);
  const [keyExist, setKeyExist] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [image, setImage] = useState("");

  // Calculate total quantity in cart for this product
  const totalQuantity = state.cart
    .filter((item) => item.product_id._id === id)
    .reduce((acc, item) => acc + item.quantity, 0);

  const protectTotalCalculation = async (id, quan) => {
    const totalReq = totalQuantity + quan;
    if (totalReq > 15) {
      toast.error(
        `${totalReq} cannot be added to cart. The quantity is limited to 15`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
    } else {
      await addToCart(id, quan);
      toast.success(`${quan} item(s) added to cart!`, {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce,
      });
    }
  };

  const productDetailsById = async () => {
    try {
      const response = await axios.post(`${uri_api}/products/get-by-id`, {
        id: id,
      });
      const product = response.data.data;
      setSelectedProduct(product);
      if (product?.sizes) setKeyExist(true);
      if (product?.images?.length) setImage(product.images[0]);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  useEffect(() => {
    productDetailsById();
  }, [id]);

  if (!selectedProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex w-full">
          <div className="flex flex-col w-[30%] p-4 gap-2">
            {selectedProduct?.images?.map((img, index) => (
              <div
                key={index}
                className="bg-gray-100 cursor-pointer"
                onMouseEnter={() => setImage(img)}
              >
                <img
                  src={`${uri}${img}`}
                  alt={selectedProduct?.name}
                  className="w-full mix-blend-multiply"
                />
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-2 w-[70%]">
            <img
              src={`${uri}${image}`}
              alt={selectedProduct?.name}
              className="w-full mix-blend-multiply"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold">{selectedProduct?.name}</h1>
          <span className="text-yellow-500">
            ⭐ {selectedProduct?.rating} ({selectedProduct?.reviewCount} reviews)
          </span>{" "}
          <span className="text-green-500">
            Stock: {selectedProduct?.quantity} left
          </span>
          <p className="text-gray-600">Rs.{selectedProduct?.price}</p>
          <p className="mt-2 text-gray-700">
            {selectedProduct?.description?.short || selectedProduct?.description}
          </p>

          {/* Size Options */}
          {keyExist && (
            <div className="mt-4">
              <span className="font-semibold">Size:</span>
              <div className="flex gap-2 mt-2">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className="border px-4 py-2 rounded hover:bg-gray-200"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center">
              <button
                className="border px-3 py-2 rounded cursor-pointer"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 p-2">{quantity}</span>
              <button
                className="border px-3 py-2 rounded cursor-pointer"
                onClick={() =>
                  setQuantity(
                    Math.min(quantity + 1, selectedProduct?.quantity, 15)
                  )
                }
              >
                +
              </button>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-6 py-2 rounded cursor-pointer">
                Buy Now
              </button>
              <button
                className="bg-orange-500 text-white px-6 py-2 rounded cursor-pointer"
                onClick={() => protectTotalCalculation(selectedProduct.id, quantity)}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Delivery & Return Info */}
          <div className="mt-6 border p-4 rounded-lg">
            <p className="flex items-center gap-2">
              <TruckIcon className="text-blue-500" /> Free Delivery
            </p>
            <p className="flex items-center gap-2 mt-2">
              <Undo2 className="text-blue-500" /> Return Delivery (30 Days)
            </p>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="m-5 p-4">
        <h1 className="text-lg bg-gray-50 mt-4 p-2 pb-3">
          Product details of {selectedProduct?.name}
        </h1>
        <span className="text-lg font-semibold mt-4">Description: </span>
        <span>{selectedProduct?.description}</span>
      </div>

      {/* Related Items */}
      <h2 className="mt-12 text-xl font-semibold">Related Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {["item1.jpg", "item2.jpg", "item3.jpg", "item4.jpg"].map(
          (img, index) => (
            <div key={index} className="border p-4 rounded-lg text-center">
              <img src={`/${img}`} alt="Related Item" className="w-full" />
              <p className="mt-2 font-semibold">Item Name</p>
              <p className="text-gray-600">Rs. 1200</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

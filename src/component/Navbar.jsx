import { Heart, ListOrdered, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { Link, replace, useLocation, useNavigate } from "react-router-dom";
import Advertisement from "./Advertisement";
import { Provider } from "../context/contextProvider";
import { useEffect, useState } from "react";
import axios from "axios";
const url = import.meta.env.VITE_AUTH_URl;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch, setIsProductByCategories } = Provider();
  const [isAuth, setIsAuth] = useState(null);


  const isActive = (path) => {
    return location.pathname === path
      ? "text-sky-950 font-bold underline-offset-1"
      : "";
  };

  const totalItems = state.cart.reduce((accum, inital) => {
    return accum += inital.quantity
  }, 0)
  const handleLogout = async () => {
    try {
      const res = await axios.post(`${url}/logout`, {}, { withCredentials: true });
     console.log(res.data.code)

      if (res.data.code === 200) {
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        navigate("/",{replace:true});
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };


  useEffect(() => {
    dispatch({ type: "TOTAL_ITEMS", payload: totalItems })
    const checkAuth = async () => {
      try {
        const res = await axios.post(`${url}/isAuthenticated`, {}, { withCredentials: true });
        if (res.data.code === 200) {
          setIsAuth(true);

        } else { setIsAuth(false); }
      }
      catch (err) { console.error("Auth check failed:", err); setIsAuth(false); }
    };
    checkAuth();


  }, [totalItems])



  return (
    <div className="border-b-2 border-b-[var(--border)] h-28 flex flex-col justify-center bg-white sticky top-0 z-50">

      <>
        <Advertisement />
      </>
      <nav className="flex items-center justify-around">
        <div>
          <h1 className="text-2xl font-bold font-sans">
            {" "}
            <Link to="/" onMouseEnter={() => setIsProductByCategories(null)} >Quick Kart</Link>{" "}
          </h1>
        </div>
        <div>
          <ul className="flex gap-12 text-[1rem] font-light">
            <li>
              <Link to="/" className={`${isActive("/")}`} onClick={() => setIsProductByCategories(null)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`${isActive("/contact")}`}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about" className={`${isActive("/about")}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/register" className={`${isActive("/sign")}`}>
                Sign In
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex">
          <div className="relative m-5">
            <Search className="absolute top-2 right-2 h-5 w-5 text-gray-700" />
            <input
              type="text"
              list="products"
              placeholder="What are you looking for?"
              className=" shadow-[var(--p-shadow)] rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-sky-200 p-2"
            />
            <datalist id="products">
              <option value='Bags'></option>
              <option value='Clothes'></option>
              <option value='Electronics'></option>
              <option value='Footweare'></option>
            </datalist>
          </div>
          <div className="flex justify-center items-center">
            <ul className="flex justify-center items-center gap-5">
              <li>
                <Link to="/cart">
                  <div className="flex relative">
                    <ShoppingCart />
                    {state.cart.length !== 0 ? <span className=" flex  h-full w-full place-content-between justify-center text-[15px] bg-black text-white  rounded-xl absolute left-4 bottom-1">{state.totalItems}</span> : ""}

                  </div>
                </Link>
              </li>

              <li>
                <Link to="#">
                  <Heart />
                </Link>
              </li>
              {isAuth && (
                <>
                  <li className="shadow-[var(--p-shadow)] rounded-full h-10 w-10 flex justify-center items-center duration-700 ease-in-out">
                    <Link to="/my-orders-history">
                      <ListOrdered />
                    </Link>
                  </li>

                  <li
                    onClick={() => handleLogout()}
                    className="shadow-[var(--p-shadow)] rounded-full h-10 w-10 flex justify-center items-center duration-700 ease-in-out cursor-pointer bg-red-500 hover:bg-red-700"
                  >
                    <LogOut className="hover:text-white" />
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>

    </div>
  );
};

export default Navbar;

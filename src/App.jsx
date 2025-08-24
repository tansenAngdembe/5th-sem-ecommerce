import { Routes, Route } from "react-router-dom"
import Layout from "./component/Layout.jsx";
import About from "./component/About.jsx";
import Home from "./component/Home.jsx"
import Contact from "./component/Contact.jsx";
import Signup from "./component/auth/Signup.jsx"
import Productpage from "./component/products/Productpage.jsx";

import Notfound from "./Notfound.jsx";
import Cart from "./component/products/Cart.jsx";
import { Success } from "./component/payments/Success.jsx";
import { Failed } from "./component/payments/Failed.jsx";
import LoginPage from "./component/auth/Login.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import CheckoutPage from "./component/payments/Checkout.jsx";
import PaymentPage from "./component/payments/Payment.jsx";
import OrderHistory from "./component/products/OrderHistory.jsx";


function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/product/:name/:id" element={<Productpage />} />

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/my-orders-history" element={<OrderHistory/>}/>
          <Route path="/failed" element={<Failed />} />


        </Route>


        <Route path="*" element={<Notfound />} />
      </Route>
    </Routes>
  )
}

export default App;
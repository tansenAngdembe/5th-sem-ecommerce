import React, { useEffect, useState } from 'react';
import { CreditCard, MapPin, Plus, Edit3, Trash2, Shield, Clock, Truck } from 'lucide-react';
import { getAddresses, myCartItems } from '../../api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
    const [selectedAddress, setSelectedAddress] = useState();
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const url = import.meta.env.VITE_URL;

    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const [cartItems, setCartData] = useState([]);
    const fetchCart = async () => {
        const response = await myCartItems();
        if (response.data.code === 200) {
            setCartData(response.data.data?.cartItems);
        } else {
            setCartData([]);
        }
    };
    const productIds = cartItems.map(item => item.product.id);




    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    // const shipping = 9.99;
    // const tax = subtotal * 0.08;
    const total = subtotal;
    const address = async () => {
        const addressResponse = await getAddresses();
        if (addressResponse.data.code === 200) {
            setAddresses(addressResponse.data.data);

        } else (
            setAddresses([])
        )

    }
    const handleAddAddress = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${url}/addresses/add`,
                newAddress,
                { withCredentials: true }
            );

            if (response.data.code === 200) {
                const addedAddress = response.data.data;
                setAddresses((prev) => [...prev, addedAddress]);

                setNewAddress({
                    name: "",
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    phone: "",
                    country: "",
                });
                setShowNewAddressForm(false);
                setSelectedAddress(addresses.length);
                address()
            } else {
                toast.success(response.data.message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,  // Ensure it closes even if hovered
                    draggable: true,
                    progress: undefined,
                    theme: "colored",

                });
                address()
            }
        } catch (error) {
            console.error("Error adding address:", error);
            alert("Something went wrong while adding address");
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteAddress = async (id) => {
        const response = await axios.post(
            `${url}/addresses/delete`,
            { id: id },
            { withCredentials: true }
        );
        if (response.data.code === 200) {
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,  // Ensure it closes even if hovered
                draggable: true,
                progress: undefined,
                theme: "colored",

            });
            address()
        } else {
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,  // Ensure it closes even if hovered
                draggable: true,
                progress: undefined,
                theme: "colored",

            });
        }
    };

    const handlePlaceOrder = async () => {
        try {
            const response = await axios.post(
                `${url}/orders/place`,
                {
                    addressId: selectedAddress,
                    productIds: productIds
                },
                { withCredentials: true }
            );
            if (response.data.code === 201) {
                navigate(`/payment/${response.data.data.orderId}`)

            }
        } catch (error) {

        }
    };

    useEffect(() => {
        address()
        fetchCart()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    {/* <div className="flex items-center mt-4 space-x-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                            <span className="ml-2 text-sm font-medium text-red-500">Shipping</span>
                        </div>
                        <div className="w-16 h-px bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                            <span className="ml-2 text-sm text-gray-600">Payment</span>
                        </div>
                        <div className="w-16 h-px bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                            <span className="ml-2 text-sm text-gray-600">Review</span>
                        </div>
                    </div> */}
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7">
                        {/* Shipping Address Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                                    Shipping Address
                                </h2>
                                <button
                                    onClick={() => setShowNewAddressForm(true)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add New
                                </button>
                            </div>

                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddress === address.id
                                                ? 'border-red-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setSelectedAddress(address.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <input
                                                        type="radio"
                                                        checked={selectedAddress === address.id}
                                                        onChange={() => setSelectedAddress(address.id)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-3 font-medium text-gray-900">{address.name}</span>
                                                    {address.isDefault && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="ml-7 text-sm text-gray-600">
                                                    <p>{address.street}</p>
                                                    <p>{address.city}, {address.state}, {address.zipCode}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAddress(address.id);
                                                    }}
                                                    className="text-gray-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* New Address Form */}
                            {showNewAddressForm && (
                                <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <div className="sm:col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Street Address"
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="State"
                                                value={newAddress.state}
                                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="ZIP Code"
                                                value={newAddress.zipCode}
                                                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Country"
                                                value={newAddress.country}
                                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowNewAddressForm(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAddAddress}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 cursor-pointer border border-transparent rounded-md hover:bg-red-600"
                                        >
                                            {loading ? "Adding..." : "Add Address"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                            <div className="w-8 h-8 bg-gray-400 rounded"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Rs {(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">Rs {subtotal.toFixed(2)}</span>
                                </div>


                                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">Rs {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                                    <span>Secure checkout with SSL encryption</span>
                                </div>
                                {/* <div className="flex items-center text-sm text-gray-600">
                                    <Truck className="w-4 h-4 mr-2 text-red-500" />
                                    <span>Free shipping on orders over $75</span>
                                </div> */}
                                <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                    <span>Estimated delivery: 3-5 business days</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full mt-6 bg-red-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            >
                                Place Order - Rs {total.toFixed(2)}
                            </button>

                            <p className="mt-4 text-xs text-gray-500 text-center">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
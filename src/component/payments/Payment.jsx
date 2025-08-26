import React, { useState } from 'react';
import { CreditCard, Smartphone, Lock, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getPaymentRequest } from '../../api';
import axios from 'axios';

const PaymentPage = () => {
    const { orderId } = useParams();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // eSewa
    const handleEsewaPayment = async () => {
        try {
            if (!orderId) return;
            setLoading(true);
            setError('');

            const res = await getPaymentRequest(orderId);

            if (res.data.code === 1 && res.data.data) {
                window.open(res.data.data, '_blank');
            } else {
                setError(res.data.message || "Failed to initiate eSewa payment.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Stripe
    const handleStripePayment = async () => {
        try {
            if (!orderId) {
                setError("Order ID is missing. Please try again.");
                return;
            }
            setLoading(true);
            setError('');

            console.log("Initiating Stripe payment for orderId:", orderId);

            // Get auth token from localStorage
            const refreshToken = localStorage.getItem('refreshToken');
            
            const headers = {};
            if (refreshToken) {
                headers.Authorization = `Bearer ${refreshToken}`;
                console.log("Sending request with auth token");
            } else {
                console.log("No auth token found - user may need to login");
            }

            const res = await axios.post("http://localhost:8008/api/v1/stripe/checkout", {
                orderId: orderId,
                currency: "NPR"
            }, { 
                headers,
                withCredentials: true // include cookies for authentication
            });

            console.log("Stripe response:", res.data);

            // Check for success (code === 200)
            if (res.data.code === 200) {
                if (res.data.data?.sessionUrl) {
                    console.log("Redirecting to Stripe checkout:", res.data.data.sessionUrl);
                    window.location.href = res.data.data.sessionUrl; // redirect user
                } else {
                    setError("Session URL not found in response.");
                }
            } 
            // Check for server error (code === 500)
            else if (res.data.code === 500) {
                setError("Server error occurred. Please try again later.");
            }
            // Handle Stripe-specific errors
            else if (res.data.message && res.data.message.includes("url_invalid")) {
                setError("Payment configuration error. Please contact support.");
            }
            // Handle other error codes
            else {
                setError(res.data.message || "Failed to initiate Stripe payment.");
            }
        } catch (err) {
            console.error("Stripe payment error:", err);
            
            // More detailed error handling
            if (err.response) {
                // Server responded with error status
                console.error("Server error response:", err.response.data);
                console.error("Status code:", err.response.status);
                setError(`Server error: ${err.response.data?.message || err.response.statusText}`);
            } else if (err.request) {
                // Network error - no response received
                console.error("Network error - no response received");
                setError("Network error. Please check your connection and try again.");
            } else {
                // Other error
                console.error("Other error:", err.message);
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Payment</h1>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Payment Method</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Stripe Option */}
                        <button
                            onClick={() => {
                                setSelectedMethod('stripe');
                                handleStripePayment();
                            }}
                            disabled={loading}
                            className={`p-4 border-2 rounded-xl transition-all ${selectedMethod === 'stripe'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <CreditCard className="w-8 h-8 text-blue-600" />
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800">Stripe</h3>
                                    <p className="text-sm text-gray-600">Credit/Debit Card</p>
                                </div>
                            </div>
                        </button>

                        {/* eSewa Option */}
                        <button
                            onClick={() => {
                                setSelectedMethod('esewa');
                                handleEsewaPayment();
                            }}
                            disabled={loading}
                            className={`p-4 border-2 rounded-xl transition-all ${selectedMethod === 'esewa'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Smartphone className="w-8 h-8 text-green-600" />
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800">eSewa</h3>
                                    <p className="text-sm text-gray-600">Digital Wallet</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {selectedMethod && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <Lock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-gray-600">
                                    Your payment information is encrypted and secure. We never store your card details or PIN.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;

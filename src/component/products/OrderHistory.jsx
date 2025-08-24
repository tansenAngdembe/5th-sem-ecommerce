import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, CreditCard, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const url = import.meta.env.VITE_URL

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // Simulate API call
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const response = await axios.post(`${url}/orders/get-user-orders`, {}, {
                withCredentials: true
            }) 
            setTimeout(() => {
                setOrders(response.data.data);
                setLoading(false);
            }, 1000);
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6">
                                    {/* Order Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.id}
                                            </h3>
                                            <div className="flex items-center mt-1 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(order.placedAt)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                Rs {order.totalAmount.toFixed(2)}
                                            </div>
                                            <div className="flex flex-col space-x-2 mt-2 gap-2 ">
                                                <span className={` px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <div className='flex gap-2'>
                                                      <span>Payment</span>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    <CreditCard className="h-3 w-3 inline mr-1" />
                                                    {order.paymentStatus}
                                                </span>

                                                </div>
                                                 
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                            <h4 className="font-medium text-gray-900">Shipping Address</h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                                        </p>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <Package className="h-4 w-4 text-gray-500 mr-2" />
                                            <h4 className="font-medium text-gray-900">Items ({order.orderItems.length})</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            <Package className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                                                            <p className="text-sm text-gray-500">{item.product.description}</p>
                                                            <div className="flex items-center mt-1">
                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                    {item.product.category.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-gray-900">
                                                            Rs {item.price.toFixed(2)} × {item.quantity}
                                                        </div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            Rs {(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
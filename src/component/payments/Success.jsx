import { CheckCircle } from 'lucide-react';
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const Success = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const transactionCode = params.get("transactionCode")
  const totalAmount = params.get("totalAmount")
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="mb-6">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-lg text-gray-600 mb-1">Amount Paid: <span className="font-semibold text-green-600">NPR {totalAmount}</span></p>
        <p className="text-sm text-gray-500">Transaction completed successfully</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Transaction Details</h3>
        <div className="text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium capitalize">Esewa Wallet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">TXN-{transactionCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600">Completed</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => {
            navigate("/")
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>← Back to Shopping</span>
        </button>
        {/* <button
          onClick={resetForm}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Make Another Payment
        </button> */}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-red-700">
          <strong>Thank you for your purchase!</strong> A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}

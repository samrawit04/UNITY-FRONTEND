// PaymentSuccess.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("paymentData");
    if (data) {
      const parsedData = JSON.parse(data);
      setPaymentData(parsedData);

      const clientId = "f35a4d7c-979f-493d-b032-aa91a1b984eb";

      // Send payment data to backend
      fetch(`http://localhost:3000/payments/${clientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Payment stored:", data);
        })
        .catch((error) => {
          console.error("Error storing payment:", error);
        });
    }
  }, []);

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <div className="mb-4 text-green-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>

          <div className="text-left space-y-2 text-gray-700">
            <p>
              <strong>Total Amount:</strong> ETB{" "}
              {parseFloat(paymentData.amount).toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> Success
            </p>
            <p>
              <strong>Customer Name:</strong> {paymentData.fname}{" "}
              {paymentData.lname}
            </p>
            <p>
              <strong>Customer Email:</strong> {paymentData.email}
            </p>
            <p>
              <strong>Transaction Reference:</strong> {paymentData.tx_ref}
            </p>

            <p>
              <strong>Channel:</strong> {paymentData.channel}
            </p>
            <p>
              <strong>Chapa Fees:</strong> ETB {paymentData.chapa_fees}
            </p>
            <p>
              <strong>Amount Received:</strong> ETB{" "}
              {paymentData.received_amount}
            </p>
            <p>
              <strong>Who Paid Fees?:</strong> {paymentData.who_paid}
            </p>

            <p>
              <strong>Paid At:</strong> {paymentData.paid_at}
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

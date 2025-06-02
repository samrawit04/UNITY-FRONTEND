// import React, { useState } from "react";
// import axios from "axios";

// interface PaymentFormProps {
//   amount: string;
// }

// const PaymentForm: React.FC<PaymentFormProps> = ({ amount }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     email: "",
//     firstName: "",
//     lastName: "",
//   });

//   // Format card number with spaces
//   const formatCardNumber = (value: string) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
//     const matches = v.match(/\d{4,16}/g);
//     const match = (matches && matches[0]) || "";
//     const parts = [];

//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }

//     if (parts.length) {
//       return parts.join(" ");
//     } else {
//       return value;
//     }
//   };

//   // Format expiry date
//   const formatExpiryDate = (value: string) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
//     if (v.length >= 2) {
//       return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
//     }
//     return v;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     if (name === "cardNumber") {
//       formattedValue = formatCardNumber(value);
//     } else if (name === "expiryDate") {
//       formattedValue = formatExpiryDate(value);
//     } else if (name === "cvv") {
//       formattedValue = value.replace(/\D/g, "").slice(0, 3);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: formattedValue,
//     }));
//   };

//   const validateForm = () => {
//     if (formData.cardNumber.replace(/\s/g, "").length < 16) {
//       setError("Please enter a valid card number");
//       return false;
//     }
//     if (formData.expiryDate.length < 5) {
//       setError("Please enter a valid expiry date");
//       return false;
//     }
//     if (formData.cvv.length < 3) {
//       setError("Please enter a valid CVV");
//       return false;
//     }
//     if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//       setError("Please enter a valid email address");
//       return false;
//     }
//     if (!formData.firstName.trim() || !formData.lastName.trim()) {
//       setError("Please enter your full name");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const tx_ref = `tx-${Date.now()}`;
//       const response = await axios.post(
//         "http://localhost:3000/payment/initialize",
//         {
//           amount: amount.replace(/[^0-9]/g, ""),
//           currency: "ETB",
//           tx_ref,
//           email: formData.email,
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           callback_url: "/payment/success",
//           return_url: "/payment/success",
//         },
//       );

//       if (response.data.data.checkout_url) {
//         // Store transaction reference for verification
//         localStorage.setItem("current_tx_ref", tx_ref);
//         window.location.href = response.data.data.checkout_url;
//       }
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Payment initialization failed. Please try again.",
//       );
//       console.error("Payment error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold">Pay With</h2>
//         <div className="flex items-center space-x-2">
//           <img src="/chapa-logo.svg" alt="Chapa" className="h-6" />
//           <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
//             TEST MODE
//           </span>
//         </div>
//       </div>

//       <div className="text-sm text-green-600 mb-6 bg-green-50 p-3 rounded-md flex items-center justify-center">
//         <span className="font-medium">Pay ETB {amount}</span>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="relative">
//           <input
//             type="text"
//             name="cardNumber"
//             value={formData.cardNumber}
//             onChange={handleInputChange}
//             placeholder="Card Number"
//             maxLength={19}
//             className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             required
//           />
//           <svg
//             className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 10h18M7 15h.01M11 15h.01M15 15h.01M19 15h.01M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
//             />
//           </svg>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="relative">
//             <input
//               type="text"
//               name="expiryDate"
//               value={formData.expiryDate}
//               onChange={handleInputChange}
//               placeholder="MM/YY"
//               maxLength={5}
//               className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//             <svg
//               className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//               />
//             </svg>
//           </div>
//           <div className="relative">
//             <input
//               type="text"
//               name="cvv"
//               value={formData.cvv}
//               onChange={handleInputChange}
//               placeholder="CVV"
//               maxLength={3}
//               className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//             <svg
//               className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//               />
//             </svg>
//           </div>
//         </div>

//         <div className="relative">
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="E-mail"
//             className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             required
//           />
//           <svg
//             className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//             />
//           </svg>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="relative">
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               placeholder="First Name"
//               className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//             <svg
//               className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//           </div>
//           <div className="relative">
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               placeholder="Last Name"
//               className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//             <svg
//               className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm flex items-center">
//             <svg
//               className="w-5 h-5 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             {error}
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full p-3 text-white rounded-md transition-colors flex items-center justify-center ${
//             loading
//               ? "bg-green-400 cursor-not-allowed"
//               : "bg-green-600 hover:bg-green-700"
//           }`}>
//           {loading ? (
//             <>
//               <svg
//                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24">
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : (
//             "Pay"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PaymentForm;

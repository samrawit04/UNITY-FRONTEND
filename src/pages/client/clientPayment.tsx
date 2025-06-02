// import React, { useState } from "react";
// import Pay from "./pay";

// const ClientPayment = () => {
//   const [fname, setFname] = useState("");
//   const [lname, setLname] = useState("");
//   const [email, setEmail] = useState("");
//   const [amount, setAmount] = useState("50");
//   const [clientId, setClientId] = useState("");
//   const tx_ref = `tx-${Date.now()}`;
//   const public_key = "CHAPUBK_TEST-wT13hhBqi9jnI7GCJunUAQNGHb2HMYC3";

//   return (
//     <>
//       <label htmlFor="fname">First Name</label>
//       <br />
//       <input
//         id="fname"
//         onChange={(e) => setFname(e.target.value)}
//         type="text"
//       />
//       <br />
//       <label htmlFor="lname">Last Name</label>
//       <br />
//       <input
//         id="lname"
//         onChange={(e) => setLname(e.target.value)}
//         type="text"
//       />
//       <br />
//       <label htmlFor="email">Email</label>
//       <br />
//       <input
//         id="email"
//         onChange={(e) => setEmail(e.target.value)}
//         type="email"
//       />
//       <br />
//       <label htmlFor="amount">Amount</label>
//       <br />
//       <input
//         id="amount"
//         onChange={(e) => setAmount(e.target.value)}
//         type="number"
//       />
//       <br />
//       <label htmlFor="clientId">Client ID</label>
//       <br />
//       <input
//         id="clientId"
//         onChange={(e) => setClientId(e.target.value)}
//         type="text"
//       />
//       <br />
//       <Pay
//         fname={fname}
//         lname={lname}
//         email={client}
//         amount={amount}
//         tx_ref={tx_ref}
//         public_key={public_key}
//         clientId={clientId}
//       />
//     </>
//   );
// };

// export default ClientPayment;

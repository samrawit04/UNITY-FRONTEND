// Pay.tsx
import React from "react";

interface PayProps {
  fname: string;
  lname: string;
  amount: string;
  tx_ref: string;
  public_key: string;
  clientId: string; // UUID of the client
}

const Pay: React.FC<PayProps> = ({
  fname,
  lname,
  amount,
  tx_ref,
  public_key,
  clientId,
}) => {
  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    localStorage.setItem(
      "paymentData",
      JSON.stringify({
        fname,
        lname,
        amount: numericAmount,
        tx_ref,
        paid_at: new Date().toLocaleString("en-US", {
          timeZone: "Africa/Addis_Ababa",
        }),
        chapa_fees: 30.85,
        received_amount: numericAmount - 30.85,
        who_paid: "You",
        settled: "No",
        channel: "Test",
        payment_ref: "-",
        clientId,
      }),
    );
  };

  return (
    <form
      method="POST"
      action="https://api.chapa.co/v1/hosted/pay"
      onSubmit={handleSubmit}>
      <input type="hidden" name="public_key" value={public_key} />
      <input type="hidden" name="tx_ref" value={tx_ref} />
      <input type="hidden" name="amount" value={amount.toString()} />
      <input type="hidden" name="currency" value="ETB" />
      <input type="hidden" name="first_name" value={fname} />
      <input type="hidden" name="last_name" value={lname} />
      <input type="hidden" name="title" value="Let us do this" />
      <input
        type="hidden"
        name="description"
        value="Paying with Confidence with Chapa"
      />
      <input
        type="hidden"
        name="logo"
        value="https://chapa.link/asset/images/chapa_swirl.svg"
      />
      <input
        type="hidden"
        name="callback_url"
        value="https://example.com/callbackurl"
      />
      <input
        type="hidden"
        name="return_url"
        value="http://localhost:8080/payment/success"
      />
      <input type="hidden" name="meta[title]" value="test" />
      <button type="submit">Pay Now</button>
    </form>
  );
};

export default Pay;

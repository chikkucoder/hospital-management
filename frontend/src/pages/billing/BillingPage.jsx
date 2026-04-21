import { useEffect, useState } from "react";
import { getBills } from "../../services/billingService";

export default function BillingPage() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    getBills().then((res) => setBills(res.data));
  }, []);

  return (
    <div>
      <h2>Billing</h2>

      {bills.map((bill) => (
        <div key={bill._id}>
          <p>{bill.invoiceNumber}</p>
          <p>₹{bill.totalAmount}</p>
          <p>{bill.status}</p>
        </div>
      ))}
    </div>
  );
}
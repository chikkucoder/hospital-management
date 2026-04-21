const Payment = require("../models/Payment");
const Bill = require("../models/Bill");

exports.payCash = async (req, res) => {
  const { billId } = req.body;

  const bill = await Bill.findById(billId);

  await Payment.create({
    bill: billId,
    method: "CASH",
    amount: bill.totalAmount,
    status: "success"
  });

  bill.status = "paid";
  bill.paymentSummary.paidAmount = bill.totalAmount;
  bill.paymentSummary.dueAmount = 0;

  await bill.save();

  res.json({ message: "Payment successful" });
};
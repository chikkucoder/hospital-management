const { calculateTotals } = require("../services/billingService");

// In-memory storage for demo
let bills = [];
let billIdCounter = 1;

exports.createBill = async (req, res) => {
  try {
    const { patient, appointment, items, tax, discount } = req.body;

    const updatedItems = items.map(i => ({
      ...i,
      amount: i.quantity * i.unitPrice
    }));

    const { subtotal, totalAmount } =
      calculateTotals(updatedItems, tax, discount);

    const bill = {
      _id: billIdCounter++,
      patient,
      appointment,
      items: updatedItems,
      subtotal,
      tax,
      discount,
      totalAmount,
      invoiceNumber: "INV-" + Date.now(),
      paymentSummary: {
        paidAmount: 0,
        dueAmount: totalAmount
      },
      status: "pending"
    };

    bills.push(bill);

    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBill = async (req, res) => {
  const bill = bills.find(b => b._id == req.params.id);
  if (!bill) return res.status(404).json({ error: "Bill not found" });
  res.json(bill);
};

exports.getAllBills = async (req, res) => {
  res.json(bills);
};

exports.updateBill = async (req, res) => {
  const bill = bills.find(b => b._id == req.params.id);
  if (!bill) return res.status(404).json({ error: "Bill not found" });
  Object.assign(bill, req.body);
  res.json(bill);
};
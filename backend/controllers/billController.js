import Bill from "../models/Bill.js";

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Bill.countDocuments({
    issuedAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) },
  });
  return `INV-${year}-${String(1000 + count + 1).padStart(4, "0")}`;
};

export const listBills = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.patient) filter.patient = req.query.patient;
  const bills = await Bill.find(filter)
    .sort({ issuedAt: -1 })
    .populate("patient", "name phone email")
    .lean();
  res.json(bills);
};

export const getBill = async (req, res) => {
  const bill = await Bill.findById(req.params.id).populate("patient").populate("appointment");
  if (!bill) return res.status(404).json({ error: "Bill not found" });
  res.json(bill);
};

export const createBill = async (req, res) => {
  try {
    const body = req.body || {};
    const invoiceNumber = body.invoiceNumber || (await generateInvoiceNumber());

    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = items.reduce(
      (s, it) => s + Number(it.amount || it.quantity * it.unitPrice || 0),
      0
    );
    const tax = Number(body.tax ?? 0);
    const discount = Number(body.discount ?? 0);
    const insuranceDeduction = Number(body.insuranceDeduction ?? 0);
    const totalAmount = Math.max(0, subtotal + tax - discount - insuranceDeduction);

    const status = body.status || "pending";
    const paymentSummary = body.paymentSummary || {
      paidAmount: status === "paid" ? totalAmount : status === "partial" ? +(totalAmount * 0.5).toFixed(2) : 0,
      dueAmount: 0,
    };
    paymentSummary.dueAmount = Math.max(0, totalAmount - (paymentSummary.paidAmount || 0));

    const bill = await Bill.create({
      ...body,
      invoiceNumber,
      subtotal: +subtotal.toFixed(2),
      totalAmount: +totalAmount.toFixed(2),
      paymentSummary,
      paidAt: status === "paid" ? new Date() : null,
      createdBy: req.user?.email || "system",
    });

    res.status(201).json(bill);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
};

export const updateBill = async (req, res) => {
  const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Bill not found" });
  res.json(updated);
};

export const deleteBill = async (req, res) => {
  await Bill.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};

// POST /api/bills/:id/payments — record a payment against a bill
export const recordPayment = async (req, res) => {
  const { amount, method } = req.body || {};
  const amt = Number(amount);
  if (!amt || amt <= 0) return res.status(400).json({ error: "amount must be > 0" });

  const bill = await Bill.findById(req.params.id);
  if (!bill) return res.status(404).json({ error: "Bill not found" });

  const paid = (bill.paymentSummary?.paidAmount || 0) + amt;
  const due = Math.max(0, bill.totalAmount - paid);
  bill.paymentSummary = { paidAmount: +paid.toFixed(2), dueAmount: +due.toFixed(2) };
  if (method) bill.paymentMethod = method;
  if (due === 0) {
    bill.status = "paid";
    bill.paidAt = new Date();
  } else if (paid > 0) {
    bill.status = "partial";
  }
  await bill.save();
  res.json(bill);
};

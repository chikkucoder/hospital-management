import Bill from "../models/Bill.js";

// GET /api/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
export const summary = async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30 * 86400000);
  const to = req.query.to ? new Date(req.query.to) : new Date();

  const match = { issuedAt: { $gte: from, $lte: to } };

  const [totals, byStatus, byMethod, daily] = await Promise.all([
    Bill.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          subtotal: { $sum: "$subtotal" },
          tax: { $sum: "$tax" },
          discount: { $sum: "$discount" },
          insurance: { $sum: "$insuranceDeduction" },
          total: { $sum: "$totalAmount" },
          paid: { $sum: "$paymentSummary.paidAmount" },
          due: { $sum: "$paymentSummary.dueAmount" },
        },
      },
    ]),
    Bill.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } }]),
    Bill.aggregate([{ $match: match }, { $group: { _id: "$paymentMethod", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } }]),
    Bill.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$issuedAt" } },
          count: { $sum: 1 },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({
    range: { from, to },
    totals: totals[0] || { count: 0, subtotal: 0, tax: 0, discount: 0, insurance: 0, total: 0, paid: 0, due: 0 },
    byStatus,
    byMethod,
    daily,
  });
};

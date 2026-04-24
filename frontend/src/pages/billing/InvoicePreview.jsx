const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (v) => {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const capitalize = (v) =>
  String(v || "").toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

const statusColor = (s) => ({
  paid: "#16a34a", pending: "#d97706", partial: "#2563eb", draft: "#64748b", cancelled: "#dc2626"
})[s] || "#64748b";

export default function InvoicePreview({ bill, onClose }) {
  if (!bill) return null;
  const patient = bill.patient || {};
  const appt = bill.appointment || {};
  const hospital = bill._hospitalInfo || {};

  const handlePrint = () => window.print();

  return (
    <div className="invoice-overlay no-print">
      <div className="invoice-modal">
        <div className="invoice-toolbar no-print">
          <div>
            <div className="invoice-toolbar__title">Invoice Preview</div>
            <div className="invoice-toolbar__sub">Print or save as PDF from the browser</div>
          </div>
          <div className="invoice-toolbar__actions">
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>🖨️ Print / PDF</button>
            <button className="btn btn-ghost btn-sm" style={{ color: "rgba(255,255,255,0.7)" }} onClick={onClose}>✕ Close</button>
          </div>
        </div>

        <div id="invoice-print" className="invoice-sheet">
          <div className="invoice-header">
            <div className="invoice-brand">
              <div className="invoice-brand__logo">🏥</div>
              <div>
                <div className="invoice-brand__name">{hospital.name || "MediCare Hospital"}</div>
                <div className="invoice-brand__tag">{hospital.tagline || ""}</div>
                <div className="invoice-brand__info">
                  {hospital.address}<br />
                  {hospital.phone} | {hospital.email}<br />
                  GST: {hospital.gst}
                </div>
              </div>
            </div>
            <div className="invoice-meta">
              <div className="status-pill" style={{
                background: `${statusColor(bill.status)}14`,
                color: statusColor(bill.status),
                borderColor: `${statusColor(bill.status)}30`,
              }}>
                {capitalize(bill.status)}
              </div>
              <div className="invoice-number">{bill.invoiceNumber}</div>
              <div className="invoice-meta__line">Date: {fmtDate(bill.issuedAt)}</div>
              <div className="invoice-meta__line">Due: {bill.dueDate ? fmtDate(bill.dueDate) : "Upon Receipt"}</div>
            </div>
          </div>

          <div className="invoice-divider" />

          <div className="invoice-summary-grid">
            <div className="info-card">
              <div className="info-card__label">Patient Details</div>
              <div className="info-card__title">{patient.name || "Unknown"}</div>
              <div className="info-card__text">
                UHID: {patient.uhid || "—"}<br />
                Age / Gender: {patient.age ?? "—"} / {patient.gender || "—"}<br />
                Phone: {patient.phone || "—"}<br />
                Email: {patient.email || "—"}<br />
                Address: {patient.address?.full || "—"}
              </div>
            </div>
            <div className="info-card">
              <div className="info-card__label">Visit / Admission</div>
              <div className="info-card__title">{appt.doctorName || "Walk-in"}</div>
              <div className="info-card__text">
                Department: {appt.speciality || "General"}<br />
                Visit Type: {bill.visitType || "OPD"}<br />
                Date: {appt.date || fmtDate(bill.issuedAt)}<br />
                Time: {appt.time || "—"}<br />
                Room / Bed: {bill.roomNumber || "—"}
              </div>
            </div>
            <div className="info-card">
              <div className="info-card__label">Insurance / Billing</div>
              <div className="info-card__title">{bill.insuranceProvider || "Self Pay"}</div>
              <div className="info-card__text">
                Policy No: {bill.policyNumber || "—"}<br />
                Coverage: {bill.coveragePercent ?? 0}%<br />
                Insurance Deduction: {money(bill.insuranceDeduction || 0)}<br />
                Payment Method: {bill.paymentMethod || "—"}
              </div>
            </div>
          </div>

          <div className="invoice-section-heading">Itemized Charges</div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(bill.items || []).map((item, idx) => (
                <tr key={idx} className={idx % 2 ? "alt" : ""}>
                  <td>{fmtDate(item.date || bill.issuedAt)}</td>
                  <td>
                    <div className="invoice-item-name">{item.name}</div>
                    <div className="invoice-item-sub">{item.type}</div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{money(item.unitPrice)}</td>
                  <td className="right">{money(item.amount)}</td>
                </tr>
              ))}
              <tr className="totals-row">
                <td colSpan="4">Subtotal</td>
                <td className="right">{money(bill.subtotal)}</td>
              </tr>
              <tr className="sub-row">
                <td colSpan="4">GST ({Math.round((bill.taxRate || 0.05) * 100)}%)</td>
                <td className="right">{money(bill.tax)}</td>
              </tr>
              <tr className="sub-row">
                <td colSpan="4">Discount</td>
                <td className="right">- {money(bill.discount)}</td>
              </tr>
              <tr className="sub-row">
                <td colSpan="4">Insurance Deduction</td>
                <td className="right">- {money(bill.insuranceDeduction || 0)}</td>
              </tr>
              <tr className="grand-total-row">
                <td colSpan="4">Patient Due</td>
                <td className="right" style={{ textAlign: "right" }}>{money(bill.totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div className="invoice-footer-grid">
            <div className="footer-box">
              <div className="footer-box__title">Note</div>
              <p>We have filed medical claims with your insurance, if applicable. The balance shown is your responsibility unless covered by your provider.</p>
              <p>For billing queries, contact the billing desk at {hospital.phone || "—"}.</p>
            </div>
            <div className="footer-box">
              <div className="footer-box__title">Payment Summary</div>
              <div className="pay-line"><span>Total</span><strong>{money(bill.totalAmount)}</strong></div>
              <div className="pay-line"><span>Paid</span><strong>{money(bill.paymentSummary?.paidAmount ?? 0)}</strong></div>
              <div className="pay-line"><span>Due</span><strong>{money(bill.paymentSummary?.dueAmount ?? bill.totalAmount)}</strong></div>
              <div className="pay-line"><span>Status</span><strong>{capitalize(bill.status)}</strong></div>
            </div>
          </div>

          <div className="signature-grid">
            <div><div className="signature-line" /><div className="signature-label">Authorized Signature</div></div>
            <div className="right-align"><div className="signature-line" /><div className="signature-label">Hospital Stamp</div></div>
          </div>

          <div className="invoice-note">
            Thank you for choosing {hospital.name || "MediCare Hospital"}. This is a computer-generated statement.
          </div>
        </div>
      </div>
    </div>
  );
}
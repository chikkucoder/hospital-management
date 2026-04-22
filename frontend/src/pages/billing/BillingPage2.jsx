import { useState, useRef, useEffect, useCallback } from "react";
import React from "react";
import {
  PATIENTS, APPOINTMENTS, SERVICE_CATALOG,
  TAX_RATE, DEFAULT_DISCOUNT, HOSPITAL_INFO,
  SAVED_BILLS, generateInvoiceNumber,
} from "../../data/bill";

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */
const fmt = (n) => `₹${Number(n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const today = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const now   = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const TYPE_COLOR = {
  CONSULTATION: "#4f8ef7",
  LAB:          "#22c9a0",
  MEDICINE:     "#f76c6c",
  OTHER:        "#f7b84f",
};

/* ─── QR (pure-JS, no lib) ─────────────────────────────────────────────────── */
function MiniQR({ value, size = 120 }) {
  // Build a simple visual "QR-like" block from hashed value (decorative + readable)
  const hash = [...value].reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0);
  const cells = 21;
  const grid = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      // finder patterns
      const inFinder =
        (r < 7 && c < 7) ||
        (r < 7 && c >= cells - 7) ||
        (r >= cells - 7 && c < 7);
      const innerFinder =
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= cells - 5 && c <= cells - 3) ||
        (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4);
      const finderBorder =
        (r === 0 || r === 6 || c === 0 || c === 6) && r < 7 && c < 7 ||
        (r === 0 || r === 6 || c === cells - 1 || c === cells - 7) && r < 7 && c >= cells - 7 ||
        (r === cells - 7 || r === cells - 1 || c === 0 || c === 6) && r >= cells - 7 && c < 7;

      let dark;
      if (inFinder)       dark = finderBorder || innerFinder;
      else if (r === 7 || c === 7 || r === cells - 8 || c === cells - 8) dark = false;
      else {
        // data cells — seeded from hash + position
        const seed = (hash ^ (r * 17 + c * 31)) >>> 0;
        dark = (seed % 3) !== 0;
      }
      grid.push(dark);
    }
  }
  const cell = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", borderRadius: 4 }}>
      <rect width={size} height={size} fill="white" />
      {grid.map((dark, i) => dark ? (
        <rect
          key={i}
          x={(i % cells) * cell}
          y={Math.floor(i / cells) * cell}
          width={cell}
          height={cell}
          fill="#111"
        />
      ) : null)}
    </svg>
  );
}

/* ─── Invoice Print View ───────────────────────────────────────────────────── */
function InvoiceView({ bill, patient, appointment, onClose }) {
  const printRef = useRef();

  const handlePDF = () => {
    const style = document.createElement("style");
    style.textContent = `@media print { body * { visibility:hidden } #inv-print, #inv-print * { visibility:visible } #inv-print { position:fixed;top:0;left:0;width:100% } .no-print{display:none!important} }`;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const qrData = `INVOICE:${bill.invoiceNumber}|PATIENT:${patient?.name}|AMT:${bill.totalAmount}|STATUS:${bill.status}`;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.65)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, maxWidth: 760, width: "100%",
        maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.4)"
      }}>
        {/* toolbar */}
        <div className="no-print" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 20px", borderBottom: "1px solid #eee", background: "#fafafa",
          borderRadius: "16px 16px 0 0", position: "sticky", top: 0, zIndex: 10
        }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>Invoice Preview</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handlePDF} style={{
              background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 13,
              display: "flex", alignItems: "center", gap: 6
            }}>⬇ Download PDF</button>
            <button onClick={onClose} style={{
              background: "#f1f1f1", color: "#333", border: "none", borderRadius: 8,
              padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13
            }}>✕ Close</button>
          </div>
        </div>

        {/* invoice body */}
        <div id="inv-print" ref={printRef} style={{ padding: "36px 40px", fontFamily: "'Georgia', serif" }}>
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#1a1a2e", letterSpacing: -1 }}>
                {HOSPITAL_INFO.logo} {HOSPITAL_INFO.name}
              </div>
              <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{HOSPITAL_INFO.tagline}</div>
              <div style={{ color: "#555", fontSize: 12, marginTop: 6, lineHeight: 1.7 }}>
                {HOSPITAL_INFO.address}<br />
                📞 {HOSPITAL_INFO.phone} &nbsp;|&nbsp; ✉ {HOSPITAL_INFO.email}<br />
                GST: {HOSPITAL_INFO.gst}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: "#fff",
                background: bill.status === "paid" ? "#22c9a0" : bill.status === "pending" ? "#f7b84f" : "#f76c6c",
                padding: "4px 14px", borderRadius: 20, display: "inline-block", marginBottom: 8, textTransform: "uppercase"
              }}>{bill.status}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e" }}>{bill.invoiceNumber}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                Issued: {new Date(bill.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "2px solid #1a1a2e", marginBottom: 24 }} />

          {/* patient + appointment */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            <div style={{ background: "#f8f9ff", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Bill To</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>{patient?.name}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 4, lineHeight: 1.7 }}>
                Age: {patient?.age} | {patient?.gender}<br />
                📱 {patient?.phone}<br />
                {patient?.address}
              </div>
            </div>
            {appointment && (
              <div style={{ background: "#f8f9ff", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Appointment</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{appointment.doctorName}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4, lineHeight: 1.7 }}>
                  {appointment.speciality}<br />
                  📅 {appointment.date} at {appointment.time}
                </div>
              </div>
            )}
          </div>

          {/* items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
            <thead>
              <tr style={{ background: "#1a1a2e", color: "#fff" }}>
                {["#", "Type", "Service / Item", "Qty", "Unit Price", "Amount"].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 12px", textAlign: i > 2 ? "center" : "left",
                    fontSize: 12, fontWeight: 700, letterSpacing: .5
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f9faff" }}>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#888" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: TYPE_COLOR[item.type] + "22", color: TYPE_COLOR[item.type]
                    }}>{item.type}</span>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: 13 }}>{item.name}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 13 }}>{item.quantity}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 13 }}>{fmt(item.unitPrice)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, fontSize: 13 }}>{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* totals + QR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 }}>
            {/* QR */}
            <div style={{ textAlign: "center" }}>
              <MiniQR value={qrData} size={110} />
              <div style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>Scan to verify</div>
              <div style={{ fontSize: 9, color: "#ccc" }}>{bill.invoiceNumber}</div>
            </div>

            {/* summary */}
            <div style={{ minWidth: 260 }}>
              {[
                ["Subtotal", fmt(bill.subtotal)],
                [`Tax (GST 5%)`, fmt(bill.tax)],
                ["Discount", `- ${fmt(bill.discount)}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "#555", borderBottom: "1px dashed #eee" }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between", padding: "12px 0 4px",
                fontSize: 18, fontWeight: 900, color: "#1a1a2e", borderTop: "2px solid #1a1a2e", marginTop: 6
              }}>
                <span>TOTAL</span><span>{fmt(bill.totalAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: bill.paymentSummary.dueAmount > 0 ? "#f76c6c" : "#22c9a0", marginTop: 4 }}>
                <span>Due Amount</span><span style={{ fontWeight: 700 }}>{fmt(bill.paymentSummary.dueAmount)}</span>
              </div>
              <div style={{
                marginTop: 10, background: "#f8f9ff", borderRadius: 8, padding: "8px 12px",
                fontSize: 12, color: "#555"
              }}>
                Payment Method: <strong>{bill.paymentMethod || "—"}</strong>
              </div>
            </div>
          </div>

          {/* footer */}
          <div style={{ marginTop: 32, borderTop: "1px solid #eee", paddingTop: 16, textAlign: "center", fontSize: 11, color: "#aaa" }}>
            Thank you for choosing {HOSPITAL_INFO.name}. This is a computer-generated invoice.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main BillingPage ─────────────────────────────────────────────────────── */
export default function BillingPage() {
  const [tab, setTab] = useState("create"); // "create" | "list"
  const [bills, setBills] = useState(SAVED_BILLS);

  /* form state */
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedAppt,    setSelectedAppt]    = useState("");
  const [items,           setItems]            = useState([]);
  const [discount,        setDiscount]         = useState(DEFAULT_DISCOUNT);
  const [paymentMethod,   setPaymentMethod]    = useState("Cash");
  const [billStatus,      setBillStatus]       = useState("pending");
  const [serviceSearch,   setServiceSearch]    = useState("");
  const [toast,           setToast]            = useState(null);

  /* invoice preview */
  const [viewBill, setViewBill] = useState(null);

  /* derived */
  const patientAppts = APPOINTMENTS.filter(a => a.patientId === selectedPatient);
  const subtotal     = items.reduce((s, i) => s + i.amount, 0);
  const tax          = +(subtotal * TAX_RATE).toFixed(2);
  const totalAmount  = +(subtotal + tax - discount).toFixed(2);

  const filteredServices = SERVICE_CATALOG.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.type.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* add item */
  const addService = (svc) => {
    setItems(prev => {
      const ex = prev.findIndex(i => i.name === svc.name);
      if (ex !== -1) {
        return prev.map((i, idx) => idx === ex
          ? { ...i, quantity: i.quantity + 1, amount: (i.quantity + 1) * i.unitPrice }
          : i
        );
      }
      return [...prev, { type: svc.type, name: svc.name, quantity: 1, unitPrice: svc.unitPrice, amount: svc.unitPrice }];
    });
  };

  const updateQty = (idx, qty) => {
    if (qty < 1) return removeItem(idx);
    setItems(prev => prev.map((i, x) => x === idx ? { ...i, quantity: qty, amount: qty * i.unitPrice } : i));
  };

  const removeItem = (idx) => setItems(prev => prev.filter((_, x) => x !== idx));

  /* save bill */
  const saveBill = () => {
    if (!selectedPatient) return showToast("Please select a patient", "error");
    if (items.length === 0)  return showToast("Add at least one item", "error");

    const newBill = {
      _id: `b${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(bills.length),
      patient:     selectedPatient,
      appointment: selectedAppt || null,
      items,
      subtotal, tax, discount, totalAmount,
      status: billStatus,
      paymentSummary: {
        paidAmount: billStatus === "paid" ? totalAmount : 0,
        dueAmount:  billStatus === "paid" ? 0 : totalAmount,
      },
      paymentMethod,
      createdBy: "admin",
      issuedAt:  new Date().toISOString(),
      paidAt:    billStatus === "paid" ? new Date().toISOString() : null,
    };

    setBills(prev => [newBill, ...prev]);
    setViewBill(newBill);
    resetForm();
    showToast(`Bill ${newBill.invoiceNumber} saved!`);
  };

  const resetForm = () => {
    setSelectedPatient(""); setSelectedAppt(""); setItems([]);
    setDiscount(0); setPaymentMethod("Cash"); setBillStatus("pending");
  };

  const getPatient = (id) => PATIENTS.find(p => p._id === id);
  const getAppt    = (id) => APPOINTMENTS.find(a => a._id === id);

  /* ── render ── */
  return (
    <div style={{
      minHeight: "100vh", background: "#f0f2f8",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#1a1a2e"
    }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          background: toast.type === "error" ? "#f76c6c" : "#22c9a0",
          color: "#fff", padding: "12px 22px", borderRadius: 10,
          fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,.2)",
          animation: "slideIn .3s ease"
        }}>{toast.msg}</div>
      )}

      {/* ── Invoice Modal ── */}
      {viewBill && (
        <InvoiceView
          bill={viewBill}
          patient={getPatient(viewBill.patient)}
          appointment={getAppt(viewBill.appointment)}
          onClose={() => setViewBill(null)}
        />
      )}

      {/* ── Header ── */}
      <div style={{
        background: "#1a1a2e", color: "#fff",
        padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
            💳 Billing & Invoicing
          </div>
          <div style={{ fontSize: 12, color: "#aab", marginTop: 2 }}>
            {HOSPITAL_INFO.name} &nbsp;·&nbsp; {today()} {now()}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["create", "list"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13, transition: "all .2s",
              background: tab === t ? "#4f8ef7" : "rgba(255,255,255,.1)",
              color: "#fff"
            }}>{t === "create" ? "➕ New Bill" : `📋 Bills (${bills.length})`}</button>
          ))}
        </div>
      </div>

      {/* ── Create Tab ── */}
      {tab === "create" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, padding: "24px 28px", maxWidth: 1400, margin: "0 auto" }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Patient & Appointment */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
              <SectionTitle icon="👤" title="Patient Information" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                <div>
                  <Label>Patient *</Label>
                  <select value={selectedPatient} onChange={e => { setSelectedPatient(e.target.value); setSelectedAppt(""); }} style={selectStyle}>
                    <option value="">— Select Patient —</option>
                    {PATIENTS.map(p => <option key={p._id} value={p._id}>{p.name} ({p.age}y)</option>)}
                  </select>
                </div>
                <div>
                  <Label>Appointment (optional)</Label>
                  <select value={selectedAppt} onChange={e => setSelectedAppt(e.target.value)} style={selectStyle} disabled={!selectedPatient}>
                    <option value="">— Walk-in / No Appointment —</option>
                    {patientAppts.map(a => <option key={a._id} value={a._id}>{a.doctorName} · {a.date}</option>)}
                  </select>
                </div>
              </div>
              {selectedPatient && (() => {
                const p = getPatient(selectedPatient);
                return (
                  <div style={{ marginTop: 14, background: "#f0f4ff", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#444", display: "flex", gap: 20 }}>
                    <span>📱 {p.phone}</span>
                    <span>📍 {p.address}</span>
                    <span>🧬 {p.gender} · {p.age}y</span>
                  </div>
                );
              })()}
            </div>

            {/* Service Catalog */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
              <SectionTitle icon="🔬" title="Add Services" />
              <input
                placeholder="Search services…"
                value={serviceSearch}
                onChange={e => setServiceSearch(e.target.value)}
                style={{ ...inputStyle, marginTop: 14 }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 8, marginTop: 12, maxHeight: 280, overflowY: "auto" }}>
                {filteredServices.map(svc => (
                  <button key={svc.id} onClick={() => addService(svc)} style={{
                    border: `1.5px solid ${TYPE_COLOR[svc.type]}33`,
                    background: TYPE_COLOR[svc.type] + "0d",
                    borderRadius: 10, padding: "10px 12px", cursor: "pointer",
                    textAlign: "left", transition: "all .15s"
                  }}
                    onMouseOver={e => e.currentTarget.style.background = TYPE_COLOR[svc.type] + "22"}
                    onMouseOut={e => e.currentTarget.style.background = TYPE_COLOR[svc.type] + "0d"}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, color: TYPE_COLOR[svc.type], textTransform: "uppercase", letterSpacing: .5 }}>{svc.type}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginTop: 2 }}>{svc.name}</div>
                    <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{fmt(svc.unitPrice)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Items table */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
              <SectionTitle icon="📋" title={`Bill Items (${items.length})`} />
              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb", fontSize: 14 }}>
                  No items added yet. Click a service above to add.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #eee" }}>
                      {["Type", "Item", "Qty", "Unit Price", "Amount", ""].map((h, i) => (
                        <th key={i} style={{ padding: "8px 10px", fontSize: 11, fontWeight: 700, color: "#888", textAlign: i > 1 ? "center" : "left", textTransform: "uppercase", letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                        <td style={{ padding: "10px" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: TYPE_COLOR[item.type] + "22", color: TYPE_COLOR[item.type] }}>{item.type}</span>
                        </td>
                        <td style={{ padding: "10px", fontWeight: 600, fontSize: 13 }}>{item.name}</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <button onClick={() => updateQty(i, item.quantity - 1)} style={qtyBtn}>−</button>
                            <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{item.quantity}</span>
                            <button onClick={() => updateQty(i, item.quantity + 1)} style={qtyBtn}>+</button>
                          </div>
                        </td>
                        <td style={{ padding: "10px", textAlign: "center", fontSize: 13 }}>{fmt(item.unitPrice)}</td>
                        <td style={{ padding: "10px", textAlign: "center", fontWeight: 700 }}>{fmt(item.amount)}</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <button onClick={() => removeItem(i)} style={{ background: "#fff0f0", border: "none", color: "#f76c6c", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 14 }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right column — Summary & Payment */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Totals */}
            <div style={{ background: "#1a1a2e", borderRadius: 14, padding: "24px", color: "#fff", boxShadow: "0 8px 32px rgba(26,26,46,.25)" }}>
              <SectionTitle icon="🧾" title="Bill Summary" light />
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  ["Subtotal", fmt(subtotal), false],
                  ["GST (5%)", fmt(tax), false],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#aab" }}>
                    <span>{k}</span><span style={{ color: "#fff" }}>{v}</span>
                  </div>
                ))}

                {/* Discount input */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, color: "#aab" }}>
                  <span>Discount (₹)</span>
                  <input
                    type="number" min="0" value={discount}
                    onChange={e => setDiscount(+e.target.value)}
                    style={{ width: 90, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "4px 10px", color: "#fff", fontSize: 14, textAlign: "right" }}
                  />
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 14, display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 900 }}>
                  <span>Total</span><span style={{ color: "#4f8ef7" }}>{fmt(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
              <SectionTitle icon="💰" title="Payment" />
              <div style={{ marginTop: 14 }}>
                <Label>Payment Method</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  {["Cash", "Online", "Card", "UPI"].map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)} style={{
                      padding: "10px", border: `2px solid ${paymentMethod === m ? "#4f8ef7" : "#eee"}`,
                      borderRadius: 10, background: paymentMethod === m ? "#eef4ff" : "#fff",
                      cursor: "pointer", fontWeight: 600, fontSize: 13,
                      color: paymentMethod === m ? "#4f8ef7" : "#555", transition: "all .2s"
                    }}>
                      {m === "Cash" ? "💵" : m === "Online" ? "🌐" : m === "Card" ? "💳" : "📱"} {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Label>Bill Status</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
                  {[
                    { v: "draft",   label: "Draft",   color: "#888" },
                    { v: "pending", label: "Pending", color: "#f7b84f" },
                    { v: "paid",    label: "Paid",    color: "#22c9a0" },
                  ].map(({ v, label, color }) => (
                    <button key={v} onClick={() => setBillStatus(v)} style={{
                      padding: "9px", border: `2px solid ${billStatus === v ? color : "#eee"}`,
                      borderRadius: 10, background: billStatus === v ? color + "22" : "#fff",
                      cursor: "pointer", fontWeight: 700, fontSize: 13,
                      color: billStatus === v ? color : "#aaa", transition: "all .2s"
                    }}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* QR preview */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", textAlign: "center" }}>
              <SectionTitle icon="📷" title="QR Receipt Preview" />
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <MiniQR value={`DRAFT|${selectedPatient}|${fmt(totalAmount)}|${paymentMethod}`} size={130} />
                <div style={{ fontSize: 11, color: "#aaa" }}>Will be embedded in final invoice</div>
              </div>
            </div>

            {/* Action */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={saveBill} style={{
                background: "linear-gradient(135deg,#4f8ef7,#3a6fd8)", color: "#fff",
                border: "none", borderRadius: 12, padding: "16px", fontSize: 16,
                fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(79,142,247,.4)",
                transition: "transform .15s"
              }}
                onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={e => e.currentTarget.style.transform = "none"}
              >
                💾 Save Bill & Preview Invoice
              </button>
              <button onClick={resetForm} style={{
                background: "#f5f5f5", color: "#555", border: "none", borderRadius: 12,
                padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}>🔄 Reset Form</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bills List Tab ── */}
      {tab === "list" && (
        <div style={{ padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bills.map(bill => {
              const patient = getPatient(bill.patient);
              const sc = { paid: "#22c9a0", pending: "#f7b84f", draft: "#888", failed: "#f76c6c", cancelled: "#f76c6c" };
              return (
                <div key={bill._id} style={{
                  background: "#fff", borderRadius: 14, padding: "18px 22px",
                  boxShadow: "0 2px 12px rgba(0,0,0,.07)", display: "flex",
                  justifyContent: "space-between", alignItems: "center",
                  borderLeft: `4px solid ${sc[bill.status] || "#ddd"}`
                }}>
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{bill.invoiceNumber}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                        {new Date(bill.issuedAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <div style={{ borderLeft: "1px solid #eee", paddingLeft: 20 }}>
                      <div style={{ fontWeight: 600 }}>{patient?.name || "Unknown"}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{patient?.phone}</div>
                    </div>
                    <div style={{ borderLeft: "1px solid #eee", paddingLeft: 20 }}>
                      <div style={{ fontSize: 12, color: "#888" }}>{bill.items.length} item(s)</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{bill.paymentMethod}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>{fmt(bill.totalAmount)}</div>
                      <div style={{ fontSize: 11, color: bill.paymentSummary.dueAmount > 0 ? "#f76c6c" : "#22c9a0", fontWeight: 600 }}>
                        {bill.paymentSummary.dueAmount > 0 ? `Due: ${fmt(bill.paymentSummary.dueAmount)}` : "Fully Paid"}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                      background: (sc[bill.status] || "#ddd") + "22", color: sc[bill.status] || "#ddd",
                      textTransform: "uppercase"
                    }}>{bill.status}</span>
                    <button onClick={() => setViewBill(bill)} style={{
                      background: "#eef4ff", color: "#4f8ef7", border: "none", borderRadius: 8,
                      padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13
                    }}>👁 View</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(60px); opacity:0 } to { transform: none; opacity:1 } }
        ::-webkit-scrollbar { width:6px; height:6px }
        ::-webkit-scrollbar-track { background:#f0f0f0; border-radius:3px }
        ::-webkit-scrollbar-thumb { background:#ccc; border-radius:3px }
        select:focus, input:focus { outline: 2px solid #4f8ef7; outline-offset:1px }
      `}</style>
    </div>
  );
}

/* ─── Small sub-components ─────────────────────────────────────────────────── */
const SectionTitle = ({ icon, title, light }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ fontSize: 18 }}>{icon}</span>
    <span style={{ fontWeight: 700, fontSize: 15, color: light ? "#fff" : "#1a1a2e" }}>{title}</span>
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>{children}</div>
);

/* ─── Shared styles ────────────────────────────────────────────────────────── */
const inputStyle = {
  width: "100%", boxSizing: "border-box", border: "1.5px solid #eee",
  borderRadius: 10, padding: "10px 14px", fontSize: 13,
  background: "#fafbff", color: "#1a1a2e", fontFamily: "inherit"
};

const selectStyle = {
  ...inputStyle, appearance: "none", cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32
};

const qtyBtn = {
  background: "#f0f4ff", border: "none", borderRadius: 6, width: 26, height: 26,
  cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#4f8ef7"
};
import React, { useMemo, useRef, useState } from "react";
import "./BillingPage.css";
import {
  PATIENTS,
  APPOINTMENTS,
  SERVICE_CATALOG,
  TAX_RATE,
  DEFAULT_DISCOUNT,
  HOSPITAL_INFO,
  SAVED_BILLS,
  generateInvoiceNumber,
} from "../../data/bill";

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return `${fmtDate(d)} ${d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const capitalize = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());

const statusColor = (status) => {
  switch (status) {
    case "paid":
      return "#16a34a";
    case "pending":
      return "#d97706";
    case "partial":
      return "#2563eb";
    case "draft":
      return "#64748b";
    default:
      return "#64748b";
  }
};

const TYPE_COLOR = {
  CONSULTATION: "#2563eb",
  LAB: "#0f766e",
  MEDICINE: "#dc2626",
  PROCEDURE: "#7c3aed",
  ROOM: "#b45309",
  NURSING: "#0891b2",
  EQUIPMENT: "#15803d",
  OTHER: "#475569",
};

const SIDEBAR_ITEMS = [
  { id: "patient", label: "Patient Info", icon: "👤" },
  { id: "visit", label: "Visit / Admission", icon: "🏥" },
  { id: "charges", label: "Charges", icon: "🧾" },
  { id: "insurance", label: "Insurance", icon: "🛡️" },
  { id: "payment", label: "Payment", icon: "💳" },
  { id: "summary", label: "Summary", icon: "🧮" },
  { id: "preview", label: "Preview", icon: "📷" },
  { id: "saved", label: "Saved Bills", icon: "📋" },
];

function SectionTitle({ icon, title }) {
  return (
    <div className="section-title">
      <span className="section-title__icon">{icon}</span>
      <span>{title}</span>
    </div>
  );
}

function FieldLabel({ children }) {
  return <div className="field-label">{children}</div>;
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InvoicePreview({ bill, patient, appointment, onClose, onPrint }) {
  return (
    <div className="invoice-overlay no-print">
      <div className="invoice-modal">
        <div className="invoice-toolbar no-print">
          <div>
            <div className="invoice-toolbar__title">Invoice Preview</div>
            <div className="invoice-toolbar__sub">Print or save as PDF</div>
          </div>
          <div className="invoice-toolbar__actions">
            <button className="btn btn-dark" onClick={onPrint}>
              Print / Save PDF
            </button>
            <button className="btn btn-light" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div id="invoice-print" className="invoice-sheet">
          <div className="invoice-header">
            <div className="invoice-brand">
              <div className="invoice-brand__logo">
                {HOSPITAL_INFO.logo || "🏥"}
              </div>
              <div>
                <div className="invoice-brand__name">{HOSPITAL_INFO.name}</div>
                <div className="invoice-brand__tag">{HOSPITAL_INFO.tagline}</div>
                <div className="invoice-brand__info">
                  {HOSPITAL_INFO.address}
                  <br />
                  {HOSPITAL_INFO.phone} | {HOSPITAL_INFO.email}
                  <br />
                  GST: {HOSPITAL_INFO.gst}
                </div>
              </div>
            </div>

            <div className="invoice-meta">
              <div
                className="status-pill"
                style={{
                  background: `${statusColor(bill.status)}14`,
                  color: statusColor(bill.status),
                  borderColor: `${statusColor(bill.status)}30`,
                }}
              >
                {capitalize(bill.status)}
              </div>
              <div className="invoice-number">{bill.invoiceNumber}</div>
              <div className="invoice-meta__line">
                Statement Date: {fmtDate(bill.issuedAt)}
              </div>
              <div className="invoice-meta__line">
                Due Date: {bill.dueDate ? fmtDate(bill.dueDate) : "Upon Receipt"}
              </div>
            </div>
          </div>

          <div className="invoice-divider" />

          <div className="invoice-summary-grid">
            <div className="info-card">
              <div className="info-card__label">Patient Details</div>
              <div className="info-card__title">{patient?.name || "Unknown"}</div>
              <div className="info-card__text">
                UHID: {patient?._id || "—"} <br />
                Age / Gender: {patient?.age ?? "—"} / {patient?.gender || "—"} <br />
                Phone: {patient?.phone || "—"} <br />
                Email: {patient?.email || "—"} <br />
                Address: {patient?.address || "—"}
              </div>
            </div>

            <div className="info-card">
              <div className="info-card__label">Visit / Admission</div>
              <div className="info-card__title">
                {appointment?.doctorName || "Walk-in / No Appointment"}
              </div>
              <div className="info-card__text">
                Department: {appointment?.speciality || "General"} <br />
                Visit Type: {bill.visitType || "OPD"} <br />
                Visit Date: {appointment?.date || fmtDate(bill.issuedAt)} <br />
                Time: {appointment?.time || "—"} <br />
                Room / Bed: {bill.roomNumber || "—"}
              </div>
            </div>

            <div className="info-card">
              <div className="info-card__label">Insurance / Billing</div>
              <div className="info-card__title">
                {bill.insuranceProvider || "Self Pay / No Insurance"}
              </div>
              <div className="info-card__text">
                Policy No: {bill.policyNumber || "—"} <br />
                Coverage: {bill.coveragePercent ?? 0}% <br />
                Insurance Deduction: {money(bill.insuranceDeduction || 0)} <br />
                Payment Method: {bill.paymentMethod || "—"}
              </div>
            </div>
          </div>

          <div className="invoice-section-heading">Itemized Charges</div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Date of Service</th>
                <th>Description</th>
                <th>Charges</th>
                <th>Payment / Adjustments</th>
                <th>Patient Balance</th>
              </tr>
            </thead>
            <tbody>
              {(bill.items || []).map((item, idx) => (
                <tr key={`${item.name}-${idx}`} className={idx % 2 ? "alt" : ""}>
                  <td>{fmtDate(item.date || bill.issuedAt)}</td>
                  <td>
                    <div className="invoice-item-name">{item.name}</div>
                    <div className="invoice-item-sub">
                      {item.type} · Qty: {item.quantity}
                    </div>
                  </td>
                  <td className="right">{money(item.amount)}</td>
                  <td className="right">
                    {item.adjustment ? `- ${money(item.adjustment)}` : "—"}
                  </td>
                  <td className="right">{money(item.amount)}</td>
                </tr>
              ))}

              <tr className="totals-row">
                <td colSpan="2" className="label-cell">
                  Total Hospital Charges
                </td>
                <td className="right value-cell">{money(bill.subtotal)}</td>
                <td className="right value-cell">—</td>
                <td className="right value-cell">{money(bill.subtotal)}</td>
              </tr>

              <tr className="sub-row">
                <td colSpan="2" className="label-cell">
                  Tax / GST
                </td>
                <td className="right">{money(bill.tax)}</td>
                <td className="right">—</td>
                <td className="right">{money(bill.tax)}</td>
              </tr>

              <tr className="sub-row">
                <td colSpan="2" className="label-cell">
                  Discount
                </td>
                <td className="right">- {money(bill.discount)}</td>
                <td className="right">—</td>
                <td className="right">- {money(bill.discount)}</td>
              </tr>

              <tr className="sub-row">
                <td colSpan="2" className="label-cell">
                  Insurance Deduction
                </td>
                <td className="right">- {money(bill.insuranceDeduction || 0)}</td>
                <td className="right">—</td>
                <td className="right">- {money(bill.insuranceDeduction || 0)}</td>
              </tr>

              <tr className="grand-total-row">
                <td colSpan="2" className="grand-label">
                  Patient Due
                </td>
                <td className="right grand-value">{money(bill.totalAmount)}</td>
                <td className="right grand-value">—</td>
                <td className="right grand-value">
                  {money(bill.paymentSummary?.dueAmount ?? bill.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="invoice-footer-grid">
            <div className="footer-box">
              <div className="footer-box__title">Messages</div>
              <p>
                We have filed the medical claims with your insurance, if applicable.
                The balance shown above is your responsibility unless covered by the provider.
              </p>
              <p>
                For billing questions or payment arrangements, contact the billing desk at {HOSPITAL_INFO.phone}.
              </p>
            </div>

            <div className="footer-box">
              <div className="footer-box__title">Payment Summary</div>
              <div className="pay-line">
                <span>Total</span>
                <strong>{money(bill.totalAmount)}</strong>
              </div>
              <div className="pay-line">
                <span>Paid Amount</span>
                <strong>{money(bill.paymentSummary?.paidAmount ?? 0)}</strong>
              </div>
              <div className="pay-line">
                <span>Due Amount</span>
                <strong>{money(bill.paymentSummary?.dueAmount ?? bill.totalAmount)}</strong>
              </div>
              <div className="pay-line">
                <span>Status</span>
                <strong>{capitalize(bill.status)}</strong>
              </div>
            </div>
          </div>

          <div className="signature-grid">
            <div>
              <div className="signature-line" />
              <div className="signature-label">Authorized Signature</div>
            </div>
            <div className="right-align">
              <div className="signature-line" />
              <div className="signature-label">Hospital Stamp</div>
            </div>
          </div>

          <div className="invoice-note">
            Thank you for choosing {HOSPITAL_INFO.name}. This is a computer-generated statement.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [tab, setTab] = useState("create");
  const [activeSection, setActiveSection] = useState("patient");
  const [bills, setBills] = useState(SAVED_BILLS);
  const sectionRefs = {
    patient: useRef(null),
    visit: useRef(null),
    charges: useRef(null),
    insurance: useRef(null),
    payment: useRef(null),
    summary: useRef(null),
    preview: useRef(null),
    saved: useRef(null),
  };

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedAppt, setSelectedAppt] = useState("");
  const [items, setItems] = useState([]);
  const [serviceSearch, setServiceSearch] = useState("");
  const [discount, setDiscount] = useState(DEFAULT_DISCOUNT);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [billStatus, setBillStatus] = useState("pending");
  const [visitType, setVisitType] = useState("OPD");
  const [roomNumber, setRoomNumber] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [viewBill, setViewBill] = useState(null);
  const [toast, setToast] = useState(null);

  const selectedPatientObj = useMemo(
    () => PATIENTS.find((p) => p._id === selectedPatient) || null,
    [selectedPatient]
  );

  const patientAppointments = useMemo(
    () => APPOINTMENTS.filter((a) => a.patientId === selectedPatient),
    [selectedPatient]
  );

  const selectedApptObj = useMemo(
    () => APPOINTMENTS.find((a) => a._id === selectedAppt) || null,
    [selectedAppt]
  );

  const filteredServices = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();
    if (!q) return SERVICE_CATALOG;
    return SERVICE_CATALOG.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
    );
  }, [serviceSearch]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [items]
  );

  const tax = useMemo(() => +(subtotal * TAX_RATE).toFixed(2), [subtotal]);
  const discountAmount = Number(discount || 0);

  const insuranceDeduction = useMemo(() => {
    const base = subtotal + tax - discountAmount;
    const raw = (base * Number(coveragePercent || 0)) / 100;
    return +Math.max(0, raw).toFixed(2);
  }, [subtotal, tax, discountAmount, coveragePercent]);

  const totalAmount = useMemo(() => {
    const total = subtotal + tax - discountAmount - insuranceDeduction;
    return +Math.max(0, total).toFixed(2);
  }, [subtotal, tax, discountAmount, insuranceDeduction]);

  const paidAmount = useMemo(() => {
    if (billStatus === "paid") return totalAmount;
    if (billStatus === "partial") return +(totalAmount * 0.5).toFixed(2);
    return 0;
  }, [billStatus, totalAmount]);

  const dueAmount = useMemo(
    () => +Math.max(0, totalAmount - paidAmount).toFixed(2),
    [totalAmount, paidAmount]
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    window.clearTimeout(window.__billingToastTimer);
    window.__billingToastTimer = window.setTimeout(() => setToast(null), 2600);
  };

  const goToSection = (id) => {
    setActiveSection(id);
    const ref = sectionRefs[id]?.current;
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const addService = (svc) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (x) => x.name === svc.name && x.type === svc.type
      );
      if (existingIndex !== -1) {
        return prev.map((x, idx) =>
          idx === existingIndex
            ? {
                ...x,
                quantity: x.quantity + 1,
                amount: (x.quantity + 1) * x.unitPrice,
              }
            : x
        );
      }
      return [
        ...prev,
        {
          type: svc.type,
          name: svc.name,
          quantity: 1,
          unitPrice: svc.unitPrice,
          amount: svc.unitPrice,
          date: new Date().toISOString(),
        },
      ];
    });
  };

  const updateQty = (index, qty) => {
    if (qty < 1) return removeItem(index);
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, quantity: qty, amount: qty * item.unitPrice } : item
      )
    );
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const resetForm = () => {
    setSelectedPatient("");
    setSelectedAppt("");
    setItems([]);
    setServiceSearch("");
    setDiscount(DEFAULT_DISCOUNT);
    setPaymentMethod("Cash");
    setBillStatus("pending");
    setVisitType("OPD");
    setRoomNumber("");
    setInsuranceProvider("");
    setPolicyNumber("");
    setCoveragePercent(0);
    setDueDate("");
  };

  const saveBill = () => {
    if (!selectedPatient) return showToast("Select a patient first.", "error");
    if (!items.length) return showToast("Add at least one item.", "error");

    const newBill = {
      _id: `b-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(bills.length),
      patient: selectedPatient,
      appointment: selectedAppt || null,
      items,
      subtotal,
      tax,
      discount: discountAmount,
      insuranceProvider,
      policyNumber,
      coveragePercent: Number(coveragePercent || 0),
      insuranceDeduction,
      totalAmount,
      status: billStatus,
      paymentSummary: {
        paidAmount,
        dueAmount,
      },
      paymentMethod,
      visitType,
      roomNumber,
      dueDate: dueDate || null,
      createdBy: "admin",
      issuedAt: new Date().toISOString(),
      paidAt: billStatus === "paid" ? new Date().toISOString() : null,
    };

    setBills((prev) => [newBill, ...prev]);
    setViewBill(newBill);
    resetForm();
    showToast(`Saved ${newBill.invoiceNumber}`);
  };

  const getPatient = (id) => PATIENTS.find((p) => p._id === id) || null;
  const getAppointment = (id) => APPOINTMENTS.find((a) => a._id === id) || null;

  const handlePrint = () => window.print();

  return (
    <div className="billing-page">
      {toast && (
        <div className={`toast ${toast.type === "error" ? "toast--error" : "toast--success"}`}>
          {toast.msg}
        </div>
      )}

      {viewBill && (
        <InvoicePreview
          bill={viewBill}
          patient={getPatient(viewBill.patient)}
          appointment={getAppointment(viewBill.appointment)}
          onClose={() => setViewBill(null)}
          onPrint={handlePrint}
        />
      )}

      <div className="topbar">
        <div>
          <div className="topbar__title">Invoices</div>
          <div className="topbar__sub">
            {HOSPITAL_INFO.name} · {fmtDate(new Date())}
          </div>
        </div>

        <div className="topbar__actions">
          <button
            className={tab === "create" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTab("create")}
          >
            New Invoice
          </button>
          <button
            className={tab === "list" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTab("list")}
          >
            Saved Bills ({bills.length})
          </button>
        </div>
      </div>

      {tab === "create" && (
        <div className="billing-layout">
          <aside className="sidebar">
            <div className="sidebar__title">Bill Management</div>
            <div className="sidebar__subtitle">Fill section by section</div>

            <div className="sidebar__menu">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={activeSection === item.id ? "sidebar-item active" : "sidebar-item"}
                  onClick={() => goToSection(item.id)}
                >
                  <span className="sidebar-item__icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="content-area">
            <div ref={sectionRefs.patient} className="card section-block">
              <SectionTitle icon="👤" title="Patient Information" />
              <div className="grid-2">
                <div>
                  <FieldLabel>Patient *</FieldLabel>
                  <select
                    value={selectedPatient}
                    onChange={(e) => {
                      setSelectedPatient(e.target.value);
                      setSelectedAppt("");
                    }}
                    className="input"
                  >
                    <option value="">Select patient</option>
                    {PATIENTS.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} · {p.age}y · {p.gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Patient Preview</FieldLabel>
                  <input
                    className="input"
                    value={
                      selectedPatientObj
                        ? `${selectedPatientObj.name} | ${selectedPatientObj.phone}`
                        : ""
                    }
                    disabled
                    placeholder="Selected patient details will show here"
                  />
                </div>
              </div>

              {selectedPatientObj && (
                <div className="info-strip">
                  <span>UHID: {selectedPatientObj._id}</span>
                  <span>Email: {selectedPatientObj.email}</span>
                  <span>
                    {selectedPatientObj.gender} · {selectedPatientObj.age}y
                  </span>
                </div>
              )}
            </div>

            <div ref={sectionRefs.visit} className="card section-block">
              <SectionTitle icon="🏥" title="Visit / Admission Details" />
              <div className="grid-2">
                <div>
                  <FieldLabel>Visit Type</FieldLabel>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="input"
                  >
                    <option value="OPD">OPD</option>
                    <option value="IPD">IPD</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Room / Bed</FieldLabel>
                  <input
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="Room 203 / Bed 7"
                    className="input"
                  />
                </div>

                <div>
                  <FieldLabel>Appointment</FieldLabel>
                  <select
                    value={selectedAppt}
                    onChange={(e) => setSelectedAppt(e.target.value)}
                    disabled={!selectedPatient}
                    className="input"
                  >
                    <option value="">Walk-in / No appointment</option>
                    {patientAppointments.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.doctorName} · {a.speciality} · {a.date}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Selected Doctor</FieldLabel>
                  <input
                    className="input"
                    value={
                      selectedApptObj
                        ? `${selectedApptObj.doctorName} | ${selectedApptObj.speciality}`
                        : ""
                    }
                    disabled
                    placeholder="Doctor details will show here"
                  />
                </div>
              </div>
            </div>

            <div ref={sectionRefs.charges} className="card section-block">
              <SectionTitle icon="🧾" title="Charges" />
              <div className="mt-14">
                <input
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search consultation, lab, medicine..."
                  className="input"
                />
              </div>

              <div className="service-grid">
                {filteredServices.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => addService(svc)}
                    className="service-card"
                    style={{
                      borderColor: `${TYPE_COLOR[svc.type] || TYPE_COLOR.OTHER}33`,
                      background: `${TYPE_COLOR[svc.type] || TYPE_COLOR.OTHER}08`,
                    }}
                  >
                    <div
                      className="service-card__type"
                      style={{ color: TYPE_COLOR[svc.type] || TYPE_COLOR.OTHER }}
                    >
                      {svc.type}
                    </div>
                    <div className="service-card__name">{svc.name}</div>
                    <div className="service-card__price">{money(svc.unitPrice)}</div>
                  </button>
                ))}
              </div>

              <div className="items-box">
                <div className="items-box__title">Bill Items ({items.length})</div>
                {items.length === 0 ? (
                  <div className="empty-state">No items added yet. Click a service above.</div>
                ) : (
                  <div className="table-wrap">
                    <table className="small-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Amount</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => (
                          <tr key={`${item.name}-${i}`}>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  background: `${TYPE_COLOR[item.type] || TYPE_COLOR.OTHER}18`,
                                  color: TYPE_COLOR[item.type] || TYPE_COLOR.OTHER,
                                }}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="fw-600">{item.name}</td>
                            <td>
                              <div className="qty">
                                <button onClick={() => updateQty(i, item.quantity - 1)} className="qty-btn">
                                  −
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQty(i, item.quantity + 1)} className="qty-btn">
                                  +
                                </button>
                              </div>
                            </td>
                            <td>{money(item.unitPrice)}</td>
                            <td className="fw-700">{money(item.amount)}</td>
                            <td>
                              <button onClick={() => removeItem(i)} className="delete-btn">
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div ref={sectionRefs.insurance} className="card section-block">
              <SectionTitle icon="🛡️" title="Insurance Details" />
              <div className="grid-2">
                <div>
                  <FieldLabel>Insurance Provider</FieldLabel>
                  <input
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    placeholder="e.g. Star Health"
                    className="input"
                  />
                </div>
                <div>
                  <FieldLabel>Policy Number</FieldLabel>
                  <input
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    placeholder="Policy / Claim ID"
                    className="input"
                  />
                </div>
                <div>
                  <FieldLabel>Coverage %</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={coveragePercent}
                    onChange={(e) => setCoveragePercent(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <FieldLabel>Due Date</FieldLabel>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div ref={sectionRefs.payment} className="card section-block">
              <SectionTitle icon="💳" title="Payment Details" />
              <div className="field-stack">
                <div>
                  <FieldLabel>Payment Method</FieldLabel>
                  <div className="method-grid">
                    {["Cash", "UPI", "Card", "Online"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={paymentMethod === m ? "method-btn active" : "method-btn"}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel>Payment Status</FieldLabel>
                  <div className="method-grid">
                    {["draft", "pending", "partial", "paid"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setBillStatus(s)}
                        className={billStatus === s ? "method-btn active" : "method-btn"}
                      >
                        {capitalize(s)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div ref={sectionRefs.summary} className="card card--dark section-block">
              <SectionTitle icon="🧮" title="Summary" />
              <SummaryRow label="Subtotal" value={money(subtotal)} />
              <SummaryRow label={`GST (${Math.round(TAX_RATE * 100)}%)`} value={money(tax)} />
              <SummaryRow label="Discount" value={`- ${money(discountAmount)}`} />
              <SummaryRow label="Insurance Deduction" value={`- ${money(insuranceDeduction)}`} />
              <div className="divider" />
              <div className="big-total">
                <span>Total Amount</span>
                <strong>{money(totalAmount)}</strong>
              </div>

              <div className="note-box">
                Paid: {money(paidAmount)}
                <br />
                Due: {money(dueAmount)}
              </div>

              <div className="field-stack mt-14">
                <div>
                  <FieldLabel>Discount</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div ref={sectionRefs.preview} className="card section-block">
              <SectionTitle icon="📷" title="Preview" />
              <div className="snapshot">
                <div className="snapshot__name">{HOSPITAL_INFO.name}</div>
                <div className="snapshot__sub">
                  {selectedPatientObj?.name || "Select a patient"}
                </div>
                <div className="snapshot__line">
                  Invoice: <strong>{generateInvoiceNumber(bills.length)}</strong>
                </div>
                <div className="snapshot__line">
                  Total: <strong>{money(totalAmount)}</strong>
                </div>
                <div className="snapshot__line">
                  Status: <strong>{capitalize(billStatus)}</strong>
                </div>
              </div>

              <div className="action-stack">
                <button onClick={saveBill} className="btn btn-primary">
                  Save Invoice & Preview
                </button>
                <button onClick={resetForm} className="btn btn-secondary">
                  Reset Form
                </button>
              </div>
            </div>

            <div ref={sectionRefs.saved} className="card section-block">
              <SectionTitle icon="📋" title="Saved Bills" />
              <div className="saved-list">
                {bills.map((bill) => {
                  const patient = getPatient(bill.patient);
                  return (
                    <div
                      key={bill._id}
                      className="list-row"
                      style={{ borderLeftColor: statusColor(bill.status) }}
                    >
                      <div>
                        <div className="list-row__title">{bill.invoiceNumber}</div>
                        <div className="list-row__meta">
                          {fmtDateTime(bill.issuedAt)} · {patient?.name || "Unknown"}
                        </div>
                      </div>
                      <div className="list-row__right">
                        <div className="list-row__amount">{money(bill.totalAmount)}</div>
                        <div
                          className="list-row__status"
                          style={{ color: statusColor(bill.status) }}
                        >
                          {capitalize(bill.status)}
                        </div>
                        <button className="btn btn-light" onClick={() => setViewBill(bill)}>
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
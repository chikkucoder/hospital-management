/**
 * PatientProfile.jsx
 * ──────────────────
 * Shows a full patient profile page with:
 *  - Header (breadcrumb, back button, action buttons)
 *  - Patient info sidebar (demographics, contact, medical summary)
 *  - Tabs: Overview | Timeline | Prescriptions | Reports | Appointments
 *  - Clinical Timeline with visit entries
 *
 * Same UI language as PatientList.jsx:
 *  - Emerald-700 primary color
 *  - White cards, rounded-xl, border border-gray-100
 *  - Small uppercase labels in gray-400
 *  - Clean Tailwind, no framer-motion
 */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft, Loader2, Plus, Phone, Mail, MapPin,
  Calendar, Clock, FileText, Pill, Activity, Stethoscope,
  User, Heart, AlertCircle, Droplets, Shield, Edit2,
  Download, Share2, MoreHorizontal, CheckCircle, History,
  Eye, Thermometer, Weight
} from "lucide-react";
import { patientService } from "../../services/patientService";
import { emrService }     from "../../services/emrService";

// ─────────────────────────────────────────────────────────
// SMALL REUSABLE PIECES
// ─────────────────────────────────────────────────────────

/** Two-line info row: icon + label + value */
function InfoRow({ icon: Icon, label, value, iconColor = "text-gray-400", iconBg = "bg-gray-50" }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

/** Section header inside a card */
function SectionTitle({ icon, title, color = "text-emerald-700" }) {
  return (
    <h4 className={`text-xs font-bold ${color} uppercase tracking-wider mb-4 flex items-center gap-2`}>
      {icon && <span>{icon}</span>}
      {title}
    </h4>
  );
}

/** Pill/tag badge */
function Tag({ children, color = "bg-gray-100 text-gray-500" }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${color}`}>
      {children}
    </span>
  );
}

/** Active / Follow-up Due status badge */
function StatusBadge({ status }) {
  const s = (status || "active").toLowerCase();
  if (s === "follow-up due")
    return <Tag color="bg-orange-50 text-orange-600 border border-orange-200">Follow-up Due</Tag>;
  if (s === "inactive")
    return <Tag color="bg-gray-100 text-gray-500 border border-gray-200">Inactive</Tag>;
  return <Tag color="bg-emerald-50 text-emerald-700 border border-emerald-200">Active</Tag>;
}

/** Patient initials avatar */
function Avatar({ name, size = "lg" }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const sz = size === "lg"
    ? "w-20 h-20 text-2xl"
    : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

/** Stat card used in the overview grid */
function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value || "—"}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TAB NAVIGATION
// ─────────────────────────────────────────────────────────

const TABS = ["Overview", "Timeline", "Prescriptions", "Reports", "Appointments"];

// ─────────────────────────────────────────────────────────
// TIMELINE ENTRY CARD
// ─────────────────────────────────────────────────────────

function TimelineEntry({ entry }) {
  const isPrescription = entry.type === "prescription";
  const date = entry.createdAt ? new Date(entry.createdAt) : null;

  return (
    <div className="flex gap-4 group">
      {/* Left: icon + vertical line */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm z-10
          ${isPrescription ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}>
          {isPrescription
            ? <Pill className="w-4 h-4 text-emerald-600" />
            : <FileText className="w-4 h-4 text-blue-600" />}
        </div>
        <div className="w-px flex-1 bg-gray-100 mt-2" />
      </div>

      {/* Right: content */}
      <div className="flex-1 pb-6">
        {/* Date + time */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {date ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
          </span>
          <span className="text-[10px] text-gray-300">•</span>
          <span className="text-[10px] text-gray-400">
            {date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-emerald-100 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h5 className="text-sm font-bold text-gray-900">
                {isPrescription ? "Diagnosis & Prescription" : entry.reportType || "Lab Report"}
              </h5>
              {entry.doctorName && (
                <p className="text-[11px] text-gray-400 mt-0.5">Dr. {entry.doctorName}</p>
              )}
            </div>
            <Tag color={isPrescription ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}>
              {entry.type}
            </Tag>
          </div>

          {/* Notes */}
          {entry.notes && (
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{entry.notes}</p>
          )}

          {/* Medicines */}
          {entry.medicines && entry.medicines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.medicines.map((med, i) => (
                <span key={i} className="text-[11px] font-semibold px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-600">
                  💊 {med.name} {med.dosage && `• ${med.dosage}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────

export default function PatientProfile() {
  const { id } = useParams();

  const [patient,  setPatient]  = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  // ── Fetch patient + timeline ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = await patientService.getById(id);
        setPatient(p);
        if (p) {
          const t = await emrService.getPatientTimeline(p.patientId || p.id);
          setTimeline(t || []);
        }
      } catch (err) {
        console.error("Failed to load patient:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
        <p className="text-sm text-gray-400">Loading patient profile...</p>
      </div>
    );
  }

  // ── Not found state ──
  if (!patient) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
          <User className="w-8 h-8 text-gray-200" />
        </div>
        <h2 className="text-lg font-bold text-gray-700">Patient Not Found</h2>
        <p className="text-sm text-gray-400">The patient you're looking for doesn't exist or was removed.</p>
        <Link to="/patients"
          className="mt-2 px-5 h-9 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Patients
        </Link>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER PROFILE
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Breadcrumb + back */}
        <div className="flex items-center gap-3">
          <Link to="/patients"
            className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-emerald-700 hover:border-emerald-200 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Patient Profile</h1>
            <p className="text-xs text-gray-400">
              Dashboard › Patients › <span className="text-gray-600 font-medium">{patient.name}</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors bg-white">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button className="h-9 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors bg-white">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="h-9 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors bg-white">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            className="h-9 px-4 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-all flex items-center gap-2 shadow-lg shadow-emerald-700/20">
            <Plus className="w-4 h-4" /> New Visit
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT: Sidebar + Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">

        {/* ═══════════════════════════════════════
            LEFT SIDEBAR
        ═══════════════════════════════════════ */}
        <div className="space-y-4">

          {/* ── Identity card ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Green top strip */}
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="ring-4 ring-white rounded-2xl">
                  <Avatar name={patient.name} size="lg" />
                </div>
              </div>
            </div>

            {/* Name + badges */}
            <div className="pt-14 px-6 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">{patient.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">{patient.patientId || patient.id}</p>
                </div>
                <StatusBadge status={patient.status} />
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Tag color="bg-gray-100 text-gray-500">{patient.gender}</Tag>
                <Tag color="bg-gray-100 text-gray-500">{patient.age} Years</Tag>
                {patient.bloodGroup && (
                  <Tag color="bg-red-50 text-red-600">🩸 {patient.bloodGroup}</Tag>
                )}
              </div>

              {/* Last visit */}
              {patient.lastVisit && (
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  Last visit: <span className="font-semibold text-gray-600">{patient.lastVisit}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Contact information ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <SectionTitle icon="📞" title="Contact Information" />
            <div className="space-y-3">
              <InfoRow icon={Phone} label="Phone"
                value={patient.phone || patient.contact}
                iconColor="text-emerald-600" iconBg="bg-emerald-50" />
              <InfoRow icon={Mail} label="Email"
                value={patient.email}
                iconColor="text-blue-600" iconBg="bg-blue-50" />
              <InfoRow icon={MapPin} label="Address"
                value={patient.address || [patient.city, patient.state].filter(Boolean).join(", ")}
                iconColor="text-purple-600" iconBg="bg-purple-50" />
            </div>
          </div>

          {/* ── Personal details ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <SectionTitle icon="👤" title="Personal Details" />
            <div className="space-y-3">
              <InfoRow icon={Calendar} label="Date of Birth"
                value={patient.dob
                  ? new Date(patient.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                  : undefined}
                iconColor="text-orange-600" iconBg="bg-orange-50" />
              <InfoRow icon={User} label="Marital Status"
                value={patient.maritalStatus}
                iconColor="text-pink-600" iconBg="bg-pink-50" />
              <InfoRow icon={Stethoscope} label="Occupation"
                value={patient.occupation}
                iconColor="text-indigo-600" iconBg="bg-indigo-50" />
              <InfoRow icon={Shield} label="Nationality"
                value={patient.nationality}
                iconColor="text-teal-600" iconBg="bg-teal-50" />
            </div>
          </div>

          {/* ── Medical summary ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <SectionTitle icon="🩺" title="Medical Summary" />
            <div className="space-y-3">
              {/* Allergies */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Known Allergies</p>
                {patient.allergies
                  ? <p className="text-sm text-gray-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{patient.allergies}</p>
                  : <p className="text-xs text-gray-400 italic">None recorded</p>}
              </div>
              {/* Chronic conditions */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Chronic Conditions</p>
                {patient.chronicConditions
                  ? <p className="text-sm text-gray-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">{patient.chronicConditions}</p>
                  : <p className="text-xs text-gray-400 italic">None recorded</p>}
              </div>
              {/* Current medications */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Current Medications</p>
                {patient.currentMedications
                  ? <p className="text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">{patient.currentMedications}</p>
                  : <p className="text-xs text-gray-400 italic">None recorded</p>}
              </div>
            </div>
          </div>

          {/* ── Insurance ── */}
          {(patient.insuranceProvider || patient.insuranceNumber) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <SectionTitle icon="🛡️" title="Insurance" />
              <div className="space-y-3">
                <InfoRow icon={Shield} label="Provider"
                  value={patient.insuranceProvider}
                  iconColor="text-emerald-600" iconBg="bg-emerald-50" />
                <InfoRow icon={FileText} label="Policy Number"
                  value={patient.insuranceNumber}
                  iconColor="text-gray-500" iconBg="bg-gray-50" />
              </div>
            </div>
          )}

          {/* ── Emergency contact ── */}
          {patient.emergencyName && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <SectionTitle icon="🚨" title="Emergency Contact" color="text-red-600" />
              <div className="space-y-3">
                <InfoRow icon={User} label="Name"
                  value={patient.emergencyName}
                  iconColor="text-red-500" iconBg="bg-red-50" />
                <InfoRow icon={Heart} label="Relationship"
                  value={patient.relationship}
                  iconColor="text-pink-500" iconBg="bg-pink-50" />
                <InfoRow icon={Phone} label="Phone"
                  value={patient.emergencyPhone}
                  iconColor="text-red-500" iconBg="bg-red-50" />
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════
            RIGHT CONTENT AREA
        ═══════════════════════════════════════ */}
        <div className="space-y-5">

          {/* ── Tab bar ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 h-9 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* ════════════════
              OVERVIEW TAB
          ════════════════ */}
          {activeTab === "Overview" && (
            <div className="space-y-5">

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard icon={Calendar} label="Total Visits"
                  value={timeline.length || "0"}
                  color="text-blue-600" bg="bg-blue-50" />
                <StatCard icon={Pill} label="Prescriptions"
                  value={timeline.filter(t => t.type === "prescription").length || "0"}
                  color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard icon={FileText} label="Lab Reports"
                  value={timeline.filter(t => t.type !== "prescription").length || "0"}
                  color="text-purple-600" bg="bg-purple-50" />
                <StatCard icon={Clock} label="Last Visit"
                  value={patient.lastVisit || "New"}
                  color="text-orange-500" bg="bg-orange-50" />
              </div>

              {/* Full patient info grid */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 bg-emerald-600 rounded-full inline-block" />
                  Complete Patient Information
                </h3>

                {/* Personal */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">👤 Personal</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                    {[
                      { label: "Full Name",       value: patient.name },
                      { label: "Date of Birth",   value: patient.dob ? new Date(patient.dob).toLocaleDateString("en-IN") : undefined },
                      { label: "Age",             value: patient.age ? `${patient.age} Years` : undefined },
                      { label: "Gender",          value: patient.gender },
                      { label: "Marital Status",  value: patient.maritalStatus },
                      { label: "Blood Group",     value: patient.bloodGroup },
                      { label: "Nationality",     value: patient.nationality },
                      { label: "Language",        value: patient.language },
                      { label: "Religion",        value: patient.religion },
                      { label: "Occupation",      value: patient.occupation },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-5 mb-6">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">📞 Contact</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                    {[
                      { label: "Phone",           value: patient.phone || patient.contact },
                      { label: "Alternate Phone", value: patient.altPhone },
                      { label: "Email",           value: patient.email },
                      { label: "Aadhaar",         value: patient.aadhaar },
                      { label: "PAN",             value: patient.pan },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-5 mb-6">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">📍 Address</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                    {[
                      { label: "Address Line 1", value: patient.address1 || patient.address },
                      { label: "Address Line 2", value: patient.address2 },
                      { label: "City",           value: patient.city },
                      { label: "State",          value: patient.state },
                      { label: "PIN Code",       value: patient.pin },
                      { label: "Country",        value: patient.country },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-5">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3">🩺 Medical</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                    {[
                      { label: "Allergies",          value: patient.allergies },
                      { label: "Chronic Conditions", value: patient.chronicConditions },
                      { label: "Past Surgeries",     value: patient.pastSurgeries },
                      { label: "Current Medications",value: patient.currentMedications },
                      { label: "Family History",     value: patient.familyHistory },
                      { label: "Smoking Status",     value: patient.smokingStatus },
                      { label: "Alcohol",            value: patient.alcoholConsumption },
                      { label: "Insurance Provider", value: patient.insuranceProvider },
                      { label: "Insurance No.",      value: patient.insuranceNumber },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctor / Registration info */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 bg-teal-500 rounded-full inline-block" />
                  Registration Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                  {[
                    { label: "Patient ID",         value: patient.patientId || patient.id },
                    { label: "Registration Date",  value: patient.registrationDate
                        ? new Date(patient.registrationDate).toLocaleDateString("en-IN")
                        : undefined },
                    { label: "Referred By",        value: patient.referredBy },
                    { label: "Assigned Doctor",    value: patient.doctor },
                    { label: "Specialty",          value: patient.specialty },
                    { label: "Notes",              value: patient.notes },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════
              TIMELINE TAB
          ════════════════ */}
          {activeTab === "Timeline" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  Clinical Timeline
                </h3>
                <button className="h-8 px-3 border border-gray-200 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                  <Download className="w-3 h-3" /> Export
                </button>
              </div>

              {timeline.length === 0 ? (
                /* Empty state */
                <div className="py-16 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100">
                    <Stethoscope className="w-6 h-6 text-gray-200" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No clinical records yet</p>
                  <p className="text-xs text-gray-400 mt-1">Records will appear here after the first visit.</p>
                  <button className="mt-4 px-5 h-9 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" /> Add First Note
                  </button>
                </div>
              ) : (
                <div>
                  {timeline.map((entry) => (
                    <TimelineEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════
              PRESCRIPTIONS TAB
          ════════════════ */}
          {activeTab === "Prescriptions" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  Prescriptions
                </h3>
                <button className="h-8 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> New Prescription
                </button>
              </div>
              {timeline.filter(t => t.type === "prescription").length === 0 ? (
                <div className="py-12 text-center">
                  <Pill className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No prescriptions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeline
                    .filter(t => t.type === "prescription")
                    .map((entry) => <TimelineEntry key={entry.id} entry={entry} />)}
                </div>
              )}
            </div>
          )}

          {/* ════════════════
              REPORTS TAB
          ════════════════ */}
          {activeTab === "Reports" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Lab Reports
                </h3>
                <button className="h-8 px-3 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> Upload Report
                </button>
              </div>
              {timeline.filter(t => t.type !== "prescription").length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No lab reports found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeline
                    .filter(t => t.type !== "prescription")
                    .map((entry) => <TimelineEntry key={entry.id} entry={entry} />)}
                </div>
              )}
            </div>
          )}

          {/* ════════════════
              APPOINTMENTS TAB
          ════════════════ */}
          {activeTab === "Appointments" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Appointments
                </h3>
                <button className="h-8 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> Schedule Visit
                </button>
              </div>
              <div className="py-12 text-center">
                <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No upcoming appointments</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
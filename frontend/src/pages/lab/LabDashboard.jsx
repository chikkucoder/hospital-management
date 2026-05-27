import { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import {
  FileText, Clock, CheckCircle2, AlertCircle, Download, Filter, ChevronLeft, ChevronRight, Search,
} from "lucide-react";
import { Button, Card, EmptyState, Field, inputCls, SectionHeader, selectCls, StatCard, StatusBadge } from "../../components/lab/ui";
import { downloadBlob, toCsvValue } from "../../lib/utils";
import { useReports } from "../../lib/reports-store";

const PAGE_SIZE = 6;

export default function LabReportsPage() {
  useEffect(() => {
    document.title = "Lab Reports - Lab Admin";
  }, []);

  const allReports = useReports();
  const detailPanelRef = useRef(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [testType, setTestType] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    if (allReports.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !allReports.some((report) => report.id === selectedId)) {
      setSelectedId(allReports[0].id);
    }
  }, [allReports, selectedId]);

  const testTypes = useMemo(() => Array.from(new Set(allReports.map((r) => r.testType))), [allReports]);

  const filtered = useMemo(() => {
    return allReports.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (testType !== "all" && r.testType !== testType) return false;
      if (from && r.sampleDate < from) return false;
      if (to && r.sampleDate > to) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.id.toLowerCase().includes(q) &&
          !r.patientName.toLowerCase().includes(q) &&
          !r.testName.toLowerCase().includes(q) &&
          !r.doctor.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [allReports, from, query, status, testType, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = allReports.find((r) => r.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const today = "2026-05-16";
    return {
      total: allReports.length,
      today: allReports.filter((r) => r.sampleDate === today).length,
      pending: allReports.filter((r) => r.status === "Pending").length,
      completed: allReports.filter((r) => r.status === "Completed").length,
    };
  }, [allReports]);

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setTestType("all");
    setFrom("");
    setTo("");
    setPage(1);
    toast.success("Report filters cleared.");
  }

  function exportCsv() {
    if (filtered.length === 0) {
      toast.info("There are no report rows to export.");
      return;
    }

    const header = [
      "Report ID",
      "Patient Name",
      "Patient ID",
      "Age",
      "Gender",
      "Test Name",
      "Test Type",
      "Doctor",
      "Doctor Specialty",
      "Sample Date",
      "Report Date",
      "Status",
      "Notes",
    ];

    const rows = filtered.map((report) => [
      report.id,
      report.patientName,
      report.patientId,
      report.patientAge,
      report.patientGender,
      report.testName,
      report.testType,
      report.doctor,
      report.doctorSpecialty,
      report.sampleDate,
      report.reportDate,
      report.status,
      report.notes ?? "",
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => toCsvValue(cell)).join(","))
      .join("\n");

    downloadBlob([csv], "lab-reports.csv", "text/csv;charset=utf-8");
    toast.success(`Exported ${filtered.length} report${filtered.length === 1 ? "" : "s"} to CSV.`);
  }

  function focusReport(report) {
    setSelectedId(report.id);
    detailPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function downloadReport(report) {
    const firstAttachment = report.attachments?.[0];
    if (firstAttachment?.mimetype === "application/pdf") {
      const anchor = document.createElement("a");
      anchor.href = firstAttachment.path;
      anchor.download = firstAttachment.originalName || `${report.id}.pdf`;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.click();
      toast.success(`Downloaded PDF for ${report.id}.`);
      return;
    }

    const pdf = new jsPDF();
    const left = 16;
    const right = 194;
    let y = 18;

    const writeLine = (label, value) => {
      const lines = pdf.splitTextToSize(`${label}: ${value}`, right - left);
      pdf.text(lines, left, y);
      y += lines.length * 7;
    };

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Laboratory Report Summary", left, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    writeLine("Report ID", report.id);
    writeLine("Patient", `${report.patientName} (${report.patientId})`);
    writeLine("Age / Gender", `${report.patientAge} / ${report.patientGender}`);
    writeLine("Test", report.testName);
    writeLine("Type", report.testType);
    writeLine("Doctor", `${report.doctor} (${report.doctorSpecialty})`);
    writeLine("Sample Date", report.sampleDate);
    writeLine("Report Date", report.reportDate);
    writeLine("Status", report.status);
    writeLine("Notes", report.notes || "N/A");

    y += 4;
    pdf.setFont("helvetica", "bold");
    pdf.text("History", left, y);
    y += 8;
    pdf.setFont("helvetica", "normal");

    for (const entry of report.history) {
      const lines = pdf.splitTextToSize(`- ${entry.date}: ${entry.event}`, right - left);
      if (y + lines.length * 7 > 280) {
        pdf.addPage();
        y = 18;
      }
      pdf.text(lines, left, y);
      y += lines.length * 7;
    }

    if (firstAttachment && firstAttachment.mimetype.startsWith("image/")) {
      if (y > 250) {
        pdf.addPage();
        y = 18;
      }
      pdf.setFont("helvetica", "bold");
      pdf.text("Attachment", left, y);
      y += 8;
      pdf.setFont("helvetica", "normal");
      writeLine("Uploaded File", firstAttachment.originalName);
    }

    pdf.save(`${report.id}.pdf`);
    toast.success(`Downloaded PDF for ${report.id}.`);
  }

  return (
    <>
      <SectionHeader
        title="Lab Reports"
        subtitle="Monitor diagnostic reports across patients, doctors and test categories."
        action={
          <>
            <Button variant="outline" onClick={() => setFiltersOpen((open) => !open)}>
              <Filter className="size-4" /> {filtersOpen ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button onClick={exportCsv}>
              <Download className="size-4" /> Export CSV
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Reports" value={stats.total} icon={<FileText className="size-5" />} hint="All-time records" trend={{ value: "+12%", direction: "up" }} />
        <StatCard label="Reports Today" value={stats.today} icon={<Clock className="size-5" />} tone="info" hint="Samples collected today" />
        <StatCard label="Pending" value={stats.pending} icon={<AlertCircle className="size-5" />} tone="warning" hint="Awaiting processing" />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 className="size-5" />} tone="success" hint="Released to patient" trend={{ value: "98% SLA", direction: "up" }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-semibold text-foreground text-[15px]">Reports</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} matching records</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search
                className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
                strokeWidth={1.75}
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search report, patient, test..."
                className={inputCls + " pl-9"}
              />
            </div>
          </div>

          {filtersOpen && (
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Field label="Status">
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                    className={selectCls}
                  >
                    <option value="all">All statuses</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </Field>
                <Field label="Test Type">
                  <select
                    value={testType}
                    onChange={(e) => {
                      setTestType(e.target.value);
                      setPage(1);
                    }}
                    className={selectCls}
                  >
                    <option value="all">All types</option>
                    {testTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="From">
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
                </Field>
                <Field label="To">
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
                </Field>
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/40">
                <tr className="text-left text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
                  {["Report", "Patient", "Test", "Doctor", "Sample", "Report", "Status", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 font-semibold first:pl-5 last:pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        title="No reports match your filters"
                        hint="Try clearing the date range or status."
                        icon={<Search className="size-5" />}
                      />
                    </td>
                  </tr>
                )}
                {pageRows.map((r) => {
                  const active = r.id === selectedId;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => focusReport(r)}
                      className={`cursor-pointer border-t border-border/60 row-hover ${active ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-4 py-3.5 pl-5 font-mono text-[12px] text-primary font-medium">{r.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="text-foreground font-medium">{r.patientName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {r.patientId} - {r.patientAge}y - {r.patientGender}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-foreground">{r.testName}</div>
                        <div className="text-[11px] text-muted-foreground">{r.testType}</div>
                      </td>
                      <td className="px-4 py-3.5 text-foreground">{r.doctor}</td>
                      <td className="px-4 py-3.5 text-muted-foreground tabular-nums">{r.sampleDate}</td>
                      <td className="px-4 py-3.5 text-muted-foreground tabular-nums">{r.reportDate}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3.5 pr-5 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            focusReport(r);
                          }}
                          className="text-primary hover:underline text-[12px] font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border text-[12px] text-muted-foreground">
            <span>
              Showing <span className="text-foreground font-medium">{pageRows.length}</span> of{" "}
              <span className="text-foreground font-medium">{filtered.length}</span> reports
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="size-8 rounded-lg border border-border bg-white grid place-items-center disabled:opacity-40 hover:bg-secondary transition"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-foreground font-medium tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="size-8 rounded-lg border border-border bg-white grid place-items-center disabled:opacity-40 hover:bg-secondary transition"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </Card>

        <aside ref={detailPanelRef} className="xl:sticky xl:top-24 h-fit">
          <Card className="p-5">
            {!selected ? (
              <EmptyState title="Select a report" hint="Click any row to see details." />
            ) : (
              <>
                <div className="flex items-start justify-between gap-3 mb-5 pb-5 border-b border-border">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">
                      Report
                    </div>
                    <div className="text-xl font-semibold text-foreground mt-0.5 font-mono">{selected.id}</div>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                <div className="space-y-5">
                  <DetailGroup title="Patient information">
                    <Row k="Name" v={selected.patientName} />
                    <Row k="Patient ID" v={selected.patientId} />
                    <Row
                      k="Age / Gender"
                      v={`${selected.patientAge} years - ${selected.patientGender}`}
                    />
                  </DetailGroup>

                  <DetailGroup title="Test details">
                    <Row k="Test" v={selected.testName} />
                    <Row k="Type" v={selected.testType} />
                    <Row k="Sample date" v={selected.sampleDate} />
                    <Row k="Report date" v={selected.reportDate} />
                  </DetailGroup>

                  <DetailGroup title="Referring doctor">
                    <Row k="Doctor" v={selected.doctor} />
                    <Row k="Specialty" v={selected.doctorSpecialty} />
                  </DetailGroup>

                  <Button className="w-full" onClick={() => downloadReport(selected)}>
                    <Download className="size-4" /> Download Report
                  </Button>

                  <DetailGroup title="Report history">
                    <ol className="relative border-l border-border ml-1.5 space-y-3.5">
                      {selected.history.map((h, i) => (
                        <li key={i} className="pl-4 relative">
                          <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
                          <div className="text-[13px] text-foreground font-medium">{h.event}</div>
                          <div className="text-[11px] text-muted-foreground tabular-nums">{h.date}</div>
                        </li>
                      ))}
                    </ol>
                  </DetailGroup>
                </div>
              </>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}

function DetailGroup({ title, children }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3 text-[13px]">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-foreground font-medium text-right">{v}</span>
    </div>
  );
}

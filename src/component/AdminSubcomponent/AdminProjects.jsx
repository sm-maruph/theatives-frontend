import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, FolderKanban, BellRing, Users2, Tag,
  Plus, Trash2, Pencil, Server, Globe, ArrowUpCircle, TrendingUp,
  CircleCheck, Clock, Search, X, FileSpreadsheet, FileText, Eye, EyeOff,
} from "lucide-react";

/**
 * AdminProjects — dark-themed project-management module for Theatives.
 * Matches the admin dashboard palette (#16213E / #1e293b / #6366f1 / #E94560).
 *
 * Runs on MOCK DATA. Every source is marked "WIRE API HERE".
 * Export deps (loaded lazily on click):
 *   npm install xlsx jspdf jspdf-autotable lucide-react
 */

const TODAY = new Date("2026-07-08");

const INITIAL_CATEGORIES = [
  { id: 1, name: "Web Development", kind: "service" },
  { id: 2, name: "Graphics Design", kind: "service" },
  { id: 3, name: "Game Development", kind: "service" },
  { id: 4, name: "App Development", kind: "service" },
  { id: 5, name: "Video Editing", kind: "micro" },
  { id: 6, name: "Environment Design", kind: "micro" },
  { id: 7, name: "Logo Design", kind: "micro" },
];

const blankProject = () => ({
  name: "", category: "Web Development", kind: "service",
  clientName: "", clientEmail: "", clientEmailPassword: "", clientPhone: "",
  clientOtherInfo: "", requirements: "",
  finalPrice: "", amountPaid: "", status: "Active",
  startDate: "2026-07-08", deliveryDate: "",
  domain: "", domainRegistrar: "", domainCost: "", domainRenewal: "",
  hostProvider: "", hostCost: "", hostRenewal: "",
  nextUpgrade: "", nextUpgradeInfo: "", upgradeCost: "",
  notes: "", updatedAt: "2026-07-08", updateCount: 0,
});

const INITIAL_PROJECTS = [
  {
    id: 1, name: "Nimbus Corporate Site", category: "Web Development", kind: "service",
    clientName: "Nimbus Studio", clientEmail: "sarah@nimbus.co", clientEmailPassword: "•••••••",
    clientPhone: "+8801711000001", clientOtherInfo: "Prefers WhatsApp", requirements: "5-page corporate site + blog",
    finalPrice: 180000, amountPaid: 180000, status: "Active",
    startDate: "2025-11-02", deliveryDate: "2025-12-15",
    domain: "nimbus.co", domainRegistrar: "Namecheap", domainCost: 1400, domainRenewal: "2026-11-02",
    hostProvider: "Namecheap", hostCost: 9000, hostRenewal: "2026-07-15",
    nextUpgrade: "2026-07-20", nextUpgradeInfo: "Move to VPS plan", upgradeCost: 12000,
    notes: "", updatedAt: "2026-06-10", updateCount: 3,
  },
  {
    id: 2, name: "BrightPixel Store", category: "App Development", kind: "service",
    clientName: "BrightPixel", clientEmail: "david@brightpixel.io", clientEmailPassword: "•••••••",
    clientPhone: "+8801711000002", clientOtherInfo: "", requirements: "E-commerce web app with payments",
    finalPrice: 420000, amountPaid: 300000, status: "Active",
    startDate: "2026-01-20", deliveryDate: "2026-04-30",
    domain: "brightpixel.io", domainRegistrar: "GoDaddy", domainCost: 3200, domainRenewal: "2027-01-20",
    hostProvider: "Vercel", hostCost: 24000, hostRenewal: "2026-07-11",
    nextUpgrade: "", nextUpgradeInfo: "", upgradeCost: "",
    notes: "Balance due on delivery", updatedAt: "2026-06-28", updateCount: 5,
  },
  {
    id: 3, name: "Verdant Landing", category: "Graphics Design", kind: "service",
    clientName: "Verdant Co.", clientEmail: "priya@verdant.com", clientEmailPassword: "•••••••",
    clientPhone: "+8801711000003", clientOtherInfo: "", requirements: "Landing page + brand kit",
    finalPrice: 95000, amountPaid: 95000, status: "Completed",
    startDate: "2025-08-14", deliveryDate: "2025-09-20",
    domain: "verdant.com", domainRegistrar: "Hostinger", domainCost: 1600, domainRenewal: "2026-07-22",
    hostProvider: "Hostinger", hostCost: 7000, hostRenewal: "2026-08-14",
    nextUpgrade: "", nextUpgradeInfo: "", upgradeCost: "",
    notes: "", updatedAt: "2025-09-20", updateCount: 2,
  },
  {
    id: 4, name: "Skyline Promo Reel", category: "Video Editing", kind: "micro",
    clientName: "Cloudline", clientEmail: "rafiq@cloudline.app", clientEmailPassword: "•••••••",
    clientPhone: "+8801711000004", clientOtherInfo: "Urgent turnaround", requirements: "60s promo video",
    finalPrice: 35000, amountPaid: 35000, status: "Active",
    startDate: "2026-06-25", deliveryDate: "2026-07-14",
    domain: "", domainRegistrar: "", domainCost: "", domainRenewal: "",
    hostProvider: "", hostCost: "", hostRenewal: "",
    nextUpgrade: "", nextUpgradeInfo: "", upgradeCost: "",
    notes: "", updatedAt: "2026-07-01", updateCount: 1,
  },
];

const taka = (n) => "৳" + Number(n || 0).toLocaleString("en-IN");
const daysUntil = (d) => (!d ? Infinity : Math.ceil((new Date(d) - TODAY) / 86400000));
const fmtDate = (d) => (!d ? "—" : new Date(d).toLocaleDateString("en-GB",
  { day: "2-digit", month: "short", year: "numeric" }));

const urgency = (days) => {
  if (days === Infinity) return null;
  if (days < 0) return { label: "Overdue", color: "#F87171", bg: "rgba(248,113,113,.16)" };
  if (days <= 7) return { label: `${days}d left`, color: "#F87171", bg: "rgba(248,113,113,.16)" };
  if (days <= 30) return { label: `${days}d left`, color: "#FBBF24", bg: "rgba(251,191,36,.16)" };
  return { label: `${days}d left`, color: "#34D399", bg: "rgba(52,211,153,.16)" };
};

// Dark palette derived from AdminDashboard.css
const C = {
  bg: "#16213E",          // page (matches --light-bg)
  surface: "#1E2A47",     // cards
  surfaceAlt: "#26324F",  // inputs / hover / search
  border: "rgba(255,255,255,0.09)",
  ink: "#E8ECF4",
  muted: "#94A3B8",
  primary: "#6366F1",     // buttons (matches dashboard cards)
  primaryText: "#A5B4FC", // accent text/icons on dark
  primarySoft: "rgba(99,102,241,0.16)",
  accent: "#E94560",
};

export default function AdminProjects() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES); // WIRE API HERE
  const [projects, setProjects] = useState(INITIAL_PROJECTS);       // WIRE API HERE

  const [tab, setTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("All");
  const [kindFilter, setKindFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("delivery");
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);

  const kpis = useMemo(() => {
    const active = projects.filter((p) => p.status === "Active").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const earnings = projects.reduce((s, p) => s + (Number(p.finalPrice) || 0), 0);
    const collected = projects.reduce((s, p) => s + (Number(p.amountPaid) || 0), 0);
    return { active, completed, earnings, collected, outstanding: earnings - collected };
  }, [projects]);

  const alerts = useMemo(() => {
    const items = [];
    projects.forEach((p) => {
      if (p.domainRenewal) items.push({ id: `d${p.id}`, kind: "Domain", icon: Globe,
        name: p.domain || p.name, detail: `${p.domainRegistrar || "—"} · ${p.name}`,
        date: p.domainRenewal, cost: p.domainCost, project: p.name });
      if (p.hostRenewal) items.push({ id: `h${p.id}`, kind: "Hosting", icon: Server,
        name: p.hostProvider || p.name, detail: p.name, date: p.hostRenewal, cost: p.hostCost, project: p.name });
      if (p.nextUpgrade) items.push({ id: `u${p.id}`, kind: "Upgrade", icon: ArrowUpCircle,
        name: p.nextUpgradeInfo || "Upgrade", detail: p.name, date: p.nextUpgrade, cost: p.upgradeCost, project: p.name });
    });
    return items.map((i) => ({ ...i, days: daysUntil(i.date) })).sort((a, b) => a.days - b.days);
  }, [projects]);

  const upcoming = alerts.filter((a) => a.days <= 30);

  const clientStats = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      const key = p.clientName || "Unknown";
      if (!map[key]) map[key] = { name: key, email: p.clientEmail, projects: 0, earnings: 0, active: 0 };
      map[key].projects++;
      map[key].earnings += Number(p.finalPrice) || 0;
      if (p.status === "Active") map[key].active++;
    });
    return Object.values(map).sort((a, b) => b.earnings - a.earnings);
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const okStatus = statusFilter === "All" || p.status === statusFilter;
      const okKind = kindFilter === "All" || p.kind === kindFilter;
      const hay = `${p.name} ${p.clientName} ${p.clientEmail} ${p.domain} ${p.category}`.toLowerCase();
      return okStatus && okKind && hay.includes(query.toLowerCase());
    });
    const sorters = {
      delivery: (a, b) => new Date(a.deliveryDate || "2100") - new Date(b.deliveryDate || "2100"),
      start: (a, b) => new Date(b.startDate) - new Date(a.startDate),
      price: (a, b) => (Number(b.finalPrice) || 0) - (Number(a.finalPrice) || 0),
      name: (a, b) => a.name.localeCompare(b.name),
      updated: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    };
    return [...list].sort(sorters[sortBy]);
  }, [projects, statusFilter, kindFilter, query, sortBy]);

  const saveProject = (data) => {
    if (editing) {
      setProjects((prev) => prev.map((p) => p.id === editing.id
        ? { ...p, ...data, updatedAt: "2026-07-08", updateCount: (p.updateCount || 0) + 1 } : p));
    } else {
      setProjects((prev) => [...prev, { ...data, id: Date.now(), updatedAt: "2026-07-08", updateCount: 0 }]);
    }
    setModal(null); setEditing(null);
  };
  const deleteProject = (id) => {
    if (!window.confirm("Delete this project?")) return;
    setProjects((p) => p.filter((x) => x.id !== id));
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
  };

  const toggleSel = (id) => setSelected((s) => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((p) => p.id)));

  const rowsForExport = () => {
    const src = selected.size ? projects.filter((p) => selected.has(p.id)) : filtered;
    return src.map((p) => ({
      Project: p.name, Category: p.category, Type: p.kind === "service" ? "Service" : "Micro-service",
      Client: p.clientName, "Client Email": p.clientEmail, Status: p.status,
      "Final Price": Number(p.finalPrice) || 0, Paid: Number(p.amountPaid) || 0,
      Outstanding: (Number(p.finalPrice) || 0) - (Number(p.amountPaid) || 0),
      Start: p.startDate, Delivery: p.deliveryDate, Domain: p.domain,
      "Domain Renewal": p.domainRenewal, Hosting: p.hostProvider, "Hosting Renewal": p.hostRenewal,
      "Next Upgrade": p.nextUpgrade,
    })); // client email password intentionally excluded from all exports
  };

  const exportExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(rowsForExport());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Projects");
      XLSX.writeFile(wb, `theatives-projects-${Date.now()}.xlsx`);
    } catch (e) {
      alert("Excel export needs the 'xlsx' package. Run: npm install xlsx");
    }
  };

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape" });
      const rows = rowsForExport();
      doc.setFontSize(15); doc.text("Theatives — Project Report", 14, 15);
      doc.setFontSize(9); doc.setTextColor(120);
      doc.text(`Generated ${fmtDate(TODAY)} · ${rows.length} project(s)`, 14, 21);
      autoTable(doc, {
        startY: 26,
        head: [["Project", "Client", "Status", "Price", "Paid", "Due", "Delivery", "Domain Renewal", "Host Renewal"]],
        body: rows.map((r) => [r.Project, r.Client, r.Status, taka(r["Final Price"]),
          taka(r.Paid), taka(r.Outstanding), r.Delivery || "—", r["Domain Renewal"] || "—", r["Hosting Renewal"] || "—"]),
        styles: { fontSize: 8 }, headStyles: { fillColor: [99, 102, 241] },
      });
      doc.save(`theatives-report-${Date.now()}.pdf`);
    } catch (e) {
      alert("PDF export needs 'jspdf' and 'jspdf-autotable'. Run: npm install jspdf jspdf-autotable");
    }
  };

  const generateMemo = async (p) => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const due = (Number(p.finalPrice) || 0) - (Number(p.amountPaid) || 0);
      let y = 20;
      doc.setFontSize(20); doc.setTextColor(99, 102, 241); doc.text("THEATIVES", 20, y);
      doc.setFontSize(10); doc.setTextColor(120); doc.text("Project Memo", 20, y + 6);
      doc.setTextColor(30); doc.setFontSize(9);
      doc.text(`Date: ${fmtDate(TODAY)}`, 190, y, { align: "right" });
      y += 20;
      const line = (label, val) => { doc.setTextColor(120); doc.setFontSize(9); doc.text(label, 20, y);
        doc.setTextColor(30); doc.setFontSize(11); doc.text(String(val || "—"), 20, y + 5); y += 14; };
      doc.setDrawColor(230); doc.line(20, y - 6, 190, y - 6);
      line("PROJECT", p.name);
      line("CLIENT", `${p.clientName}  ·  ${p.clientEmail}`);
      line("SERVICE", `${p.category} (${p.kind === "service" ? "Service" : "Micro-service"})`);
      line("REQUIREMENTS", p.requirements);
      line("TIMELINE", `Start ${fmtDate(p.startDate)}   ->   Delivery ${fmtDate(p.deliveryDate)}`);
      if (p.domain) line("DOMAIN", `${p.domain} (${p.domainRegistrar || "—"}) · renews ${fmtDate(p.domainRenewal)}`);
      if (p.hostProvider) line("HOSTING", `${p.hostProvider} · renews ${fmtDate(p.hostRenewal)}`);
      y += 4; doc.setDrawColor(230); doc.line(20, y - 6, 190, y - 6);
      doc.setFontSize(11);
      doc.setTextColor(120); doc.text("Final Price", 20, y); doc.setTextColor(30);
      doc.text(taka(p.finalPrice), 190, y, { align: "right" }); y += 8;
      doc.setTextColor(120); doc.text("Paid", 20, y); doc.setTextColor(5, 150, 105);
      doc.text(taka(p.amountPaid), 190, y, { align: "right" }); y += 8;
      doc.setTextColor(120); doc.text("Outstanding", 20, y);
      doc.setTextColor(due > 0 ? 220 : 30, due > 0 ? 38 : 30, due > 0 ? 38 : 30);
      doc.setFontSize(13); doc.text(taka(due), 190, y, { align: "right" });
      doc.setFontSize(8); doc.setTextColor(150);
      doc.text("Thank you for working with Theatives.", 20, 285);
      doc.save(`memo-${p.name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    } catch (e) {
      alert("Memo needs the 'jspdf' package. Run: npm install jspdf");
    }
  };

  const catName = (kind) => categories.filter((c) => c.kind === kind);
  const tabs = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "alerts", label: "Renewals & Upgrades", icon: BellRing, badge: upcoming.length },
    { key: "clients", label: "Clients", icon: Users2 },
    { key: "categories", label: "Categories", icon: Tag },
  ];

  return (
    <div style={{ background: C.bg, height: "100%", overflowY: "auto", padding: 24, color: C.ink,
      fontFamily: "'Inter', system-ui, sans-serif", boxSizing: "border-box" }}>
      <style>{`
        .ap-scope *{box-sizing:border-box;}
        .ap-card{background:${C.surface};border:1px solid ${C.border};border-radius:14px;}
        .ap-tab{transition:all .15s ease;} .ap-tab:hover{background:${C.primarySoft};}
        .ap-row:hover{background:rgba(255,255,255,0.03);}
        .ap-btn{transition:all .15s ease;cursor:pointer;} .ap-btn:hover{filter:brightness(1.12);}
        .ap-ico:hover{background:${C.primarySoft};}
        table{border-collapse:collapse;width:100%;}
        th{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:${C.muted};
           text-align:left;padding:11px 12px;font-weight:600;}
        td{padding:12px;font-size:13px;border-top:1px solid ${C.border};vertical-align:middle;color:${C.ink};}
        .ap-scope input,.ap-scope select,.ap-scope textarea{
          font-family:inherit;color:${C.ink};background:${C.surfaceAlt};color-scheme:dark;}
        .ap-scope input::placeholder,.ap-scope textarea::placeholder{color:${C.muted};}
        .ap-scope input[type=checkbox]{accent-color:${C.primary};width:15px;height:15px;cursor:pointer;}
        .ap-scope::-webkit-scrollbar{width:10px;}
        .ap-scope::-webkit-scrollbar-thumb{background:${C.surfaceAlt};border-radius:8px;}
        .ap-scope div::-webkit-scrollbar{height:8px;}
        .ap-scope div::-webkit-scrollbar-thumb{background:${C.surfaceAlt};border-radius:8px;}
      `}</style>
      <div className="ap-scope">

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: C.ink }}>Projects</h1>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13.5 }}>
            Manage projects, clients, renewals, upgrades & earnings
          </p>
        </div>
        <button className="ap-btn" onClick={() => { setEditing(null); setModal("project"); }}
          style={{ display: "flex", alignItems: "center", gap: 7, background: C.primary,
            color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontSize: 13.5, fontWeight: 600 }}>
          <Plus size={16} /> New project
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginBottom: 22 }}>
        <Kpi icon={FolderKanban} tint="#A5B4FC" label="Active projects" value={kpis.active} sub={`${kpis.completed} completed`} />
        <Kpi icon={CircleCheck} tint="#34D399" label="Total earnings" value={taka(kpis.earnings)} sub={`${taka(kpis.collected)} collected`} />
        <Kpi icon={TrendingUp} tint="#F87171" label="Outstanding" value={taka(kpis.outstanding)} sub="unpaid balance" />
        <Kpi icon={BellRing} tint="#FBBF24" label="Alerts <= 30 days" value={upcoming.length} sub="renewals + upgrades" />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} className="ap-tab ap-btn" onClick={() => setTab(t.key)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10,
                border: `1px solid ${active ? C.primary : C.border}`, background: active ? C.primary : C.surface,
                color: active ? "#fff" : C.ink, fontSize: 13.5, fontWeight: 600 }}>
              <t.icon size={16} /> {t.label}
              {t.badge > 0 && <span style={{ background: active ? "rgba(255,255,255,.25)" : "rgba(248,113,113,.2)",
                color: active ? "#fff" : "#F87171", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{t.badge}</span>}
            </button>
          );
        })}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
          <div className="ap-card" style={{ overflow: "hidden" }}>
            <SectionHead icon={BellRing} title="Next renewals & upgrades" note="Soonest first" />
            <table>
              <thead><tr><th>What</th><th>Type</th><th>When</th><th>Status</th></tr></thead>
              <tbody>
                {alerts.slice(0, 6).map((a) => {
                  const u = urgency(a.days);
                  return (
                    <tr key={a.id} className="ap-row">
                      <td><div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <a.icon size={15} color={C.muted} />
                        <div><div style={{ fontWeight: 600 }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{a.detail}</div></div>
                      </div></td>
                      <td>{a.kind}</td><td>{fmtDate(a.date)}</td>
                      <td>{u && <Pill color={u.color} bg={u.bg}>{u.label}</Pill>}</td>
                    </tr>
                  );
                })}
                {alerts.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: C.muted, padding: 24 }}>Nothing scheduled.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="ap-card" style={{ overflow: "hidden" }}>
            <SectionHead icon={Users2} title="Top clients" note="By earnings" />
            <div>
              {clientStats.slice(0, 5).map((c) => (
                <div key={c.name} className="ap-row" style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
                  <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{c.projects} project(s)</div></div>
                  <div style={{ fontWeight: 700, color: C.primaryText }}>{taka(c.earnings)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="ap-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 10, padding: "14px 16px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surfaceAlt, borderRadius: 9,
              padding: "7px 11px", flex: 1, minWidth: 180 }}>
              <Search size={15} color={C.muted} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project, client, domain..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13.5, width: "100%", color: C.ink }} />
            </div>
            <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} style={selStyle}>
              <option value="All">All types</option><option value="service">Services</option><option value="micro">Micro-services</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selStyle}>
              <option>All</option><option>Active</option><option>Completed</option><option>On Hold</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selStyle}>
              <option value="delivery">Sort: Delivery date</option>
              <option value="start">Sort: Newest start</option>
              <option value="price">Sort: Price high-low</option>
              <option value="name">Sort: Name A-Z</option>
              <option value="updated">Sort: Recently updated</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0 16px 12px", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 12.5, color: C.muted }}>
              {selected.size ? `${selected.size} selected` : `${filtered.length} project(s)`} · exports {selected.size ? "selection" : "all shown"}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="ap-btn" onClick={exportExcel} style={outBtn("#34D399")}>
                <FileSpreadsheet size={15} /> Excel
              </button>
              <button className="ap-btn" onClick={exportPDF} style={outBtn("#F87171")}>
                <FileText size={15} /> PDF
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr>
                <th style={{ width: 34 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                <th>Project</th><th>Client</th><th>Category</th><th>Price</th><th>Paid</th>
                <th>Delivery</th><th>Status</th><th>Updated</th><th></th>
              </tr></thead>
              <tbody>
                {filtered.map((p) => {
                  const due = (Number(p.finalPrice) || 0) - (Number(p.amountPaid) || 0);
                  return (
                    <tr key={p.id} className="ap-row">
                      <td><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSel(p.id)} /></td>
                      <td><div style={{ fontWeight: 600 }}>{p.name}</div>
                        {p.domain && <div style={{ fontSize: 11.5, color: C.muted }}>{p.domain}</div>}</td>
                      <td><div>{p.clientName}</div><div style={{ fontSize: 11.5, color: C.muted }}>{p.clientEmail}</div></td>
                      <td><Pill color={p.kind === "service" ? C.primaryText : "#C084FC"}
                        bg={p.kind === "service" ? C.primarySoft : "rgba(192,132,252,.16)"}>{p.category}</Pill></td>
                      <td style={{ fontWeight: 600 }}>{taka(p.finalPrice)}</td>
                      <td style={{ color: due > 0 ? "#F87171" : "#34D399" }}>
                        {taka(p.amountPaid)}{due > 0 && <div style={{ fontSize: 11 }}>due {taka(due)}</div>}</td>
                      <td>{fmtDate(p.deliveryDate)}</td>
                      <td><StatusPill status={p.status} /></td>
                      <td style={{ fontSize: 12, color: C.muted }}>{fmtDate(p.updatedAt)}<div style={{ fontSize: 11 }}>x{p.updateCount}</div></td>
                      <td><div style={{ display: "flex", gap: 2 }}>
                        <IconBtn title="Client memo (PDF)" onClick={() => generateMemo(p)}><FileText size={15} color={C.muted} /></IconBtn>
                        <IconBtn title="Edit" onClick={() => { setEditing(p); setModal("project"); }}><Pencil size={15} color={C.primaryText} /></IconBtn>
                        <IconBtn title="Delete" onClick={() => deleteProject(p.id)}><Trash2 size={15} color="#F87171" /></IconBtn>
                      </div></td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center", color: C.muted, padding: 28 }}>No projects match your filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <div className="ap-card" style={{ overflow: "hidden" }}>
          <SectionHead icon={BellRing} title="Renewals & upgrades" note="Domains, hosting & scheduled upgrades — soonest first" />
          <div style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Item</th><th>Type</th><th>Project</th><th>Due</th><th>Cost</th><th>Status</th></tr></thead>
            <tbody>
              {alerts.map((a) => {
                const u = urgency(a.days);
                return (
                  <tr key={a.id} className="ap-row">
                    <td><div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <a.icon size={15} color={C.muted} /><span style={{ fontWeight: 600 }}>{a.name}</span></div></td>
                    <td>{a.kind}</td>
                    <td style={{ color: C.muted }}>{a.project}</td>
                    <td>{fmtDate(a.date)}</td><td>{taka(a.cost)}</td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {u && a.days <= 30 && <Clock size={13} color={u.color} />}
                      {u && <Pill color={u.color} bg={u.bg}>{u.label}</Pill>}</div></td>
                  </tr>
                );
              })}
              {alerts.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: C.muted, padding: 28 }}>No renewals or upgrades scheduled.</td></tr>}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {tab === "clients" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
          {clientStats.map((cl) => (
            <div key={cl.name} className="ap-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primarySoft, color: C.primaryText,
                  display: "grid", placeItems: "center", fontWeight: 700 }}>{cl.name[0]}</div>
                <div><div style={{ fontWeight: 700 }}>{cl.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{cl.email}</div></div>
              </div>
              <Stat label="Projects" value={cl.projects} />
              <Stat label="Active" value={cl.active} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingTop: 10,
                marginTop: 6, borderTop: `1px solid ${C.border}` }}>
                <span style={{ color: C.muted }}>Total earnings</span>
                <span style={{ fontWeight: 700, color: C.primaryText }}>{taka(cl.earnings)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "categories" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {["service", "micro"].map((kind) => (
            <CategoryCard key={kind} kind={kind} items={catName(kind)}
              onAdd={(name) => setCategories((c) => [...c, { id: Date.now(), name, kind }])}
              onDelete={(id) => setCategories((c) => c.filter((x) => x.id !== id))} />
          ))}
        </div>
      )}

      {modal === "project" && (
        <ProjectModal categories={categories} initial={editing}
          onClose={() => { setModal(null); setEditing(null); }} onSave={saveProject} />
      )}
      </div>
    </div>
  );
}

const selStyle = { padding: "8px 10px", borderRadius: 9, border: `1px solid ${C.border}`,
  fontSize: 13, background: C.surfaceAlt, color: C.ink, cursor: "pointer" };
const outBtn = (color) => ({ display: "flex", alignItems: "center", gap: 6, background: color + "22",
  color, border: `1px solid ${color}44`, padding: "8px 13px", borderRadius: 9, fontSize: 13, fontWeight: 600 });

function IconBtn({ children, onClick, title }) {
  return <button className="ap-ico ap-btn" title={title} onClick={onClick}
    style={{ border: "none", background: "transparent", padding: 6, borderRadius: 7, display: "grid", placeItems: "center" }}>{children}</button>;
}
function Stat({ label, value }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
    <span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 600, color: C.ink }}>{value}</span></div>;
}
function Kpi({ icon: Icon, tint, label, value, sub }) {
  return (
    <div className="ap-card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><div style={{ fontSize: 12.5, color: C.muted }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 2px", color: C.ink }}>{value}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{sub}</div></div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: tint + "22", display: "grid", placeItems: "center" }}>
          <Icon size={19} color={tint} /></div>
      </div>
    </div>
  );
}
function SectionHead({ icon: Icon, title, note }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "15px 16px 13px", borderBottom: `1px solid ${C.border}` }}>
      <Icon size={17} color={C.primaryText} />
      <div><div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>{title}</div>
        {note && <div style={{ fontSize: 12, color: C.muted }}>{note}</div>}</div>
    </div>
  );
}
const Pill = ({ children, color, bg }) => (
  <span style={{ background: bg, color, padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>
);
function StatusPill({ status }) {
  const map = { Active: ["#34D399", "rgba(52,211,153,.16)"], Completed: ["#A5B4FC", "rgba(99,102,241,.16)"],
    "On Hold": ["#FBBF24", "rgba(251,191,36,.16)"], Paused: ["#94A3B8", "rgba(148,163,184,.16)"] };
  const [color, bg] = map[status] || ["#94A3B8", "rgba(148,163,184,.16)"];
  return <Pill color={color} bg={bg}>{status}</Pill>;
}

function CategoryCard({ kind, items, onAdd, onDelete }) {
  const [name, setName] = useState("");
  const title = kind === "service" ? "Services" : "Micro-services";
  const singular = kind === "service" ? "service" : "micro-service";
  return (
    <div className="ap-card" style={{ overflow: "hidden" }}>
      <SectionHead icon={Tag} title={title} note={`${items.length} categor${items.length === 1 ? "y" : "ies"}`} />
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={`Add a ${singular}...`}
            style={{ ...field, marginBottom: 0 }} onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { onAdd(name.trim()); setName(""); } }} />
          <button className="ap-btn" onClick={() => { if (name.trim()) { onAdd(name.trim()); setName(""); } }}
            style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 9, padding: "0 14px", fontWeight: 600, cursor: "pointer" }}>Add</button>
        </div>
        {items.map((it) => (
          <div key={it.id} className="ap-row" style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "9px 4px", borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 13.5, color: C.ink }}>{it.name}</span>
            <IconBtn title="Delete" onClick={() => onDelete(it.id)}><Trash2 size={14} color="#F87171" /></IconBtn>
          </div>
        ))}
        {items.length === 0 && <div style={{ fontSize: 12.5, color: C.muted, padding: "8px 4px" }}>No categories yet.</div>}
      </div>
    </div>
  );
}

const field = { width: "100%", padding: "9px 11px", borderRadius: 9, border: `1px solid ${C.border}`,
  fontSize: 13.5, outline: "none", marginBottom: 12, boxSizing: "border-box", background: C.surfaceAlt, color: C.ink };
const lbl = { fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 };
const Row = ({ children }) => <div style={{ display: "flex", gap: 10 }}>{children}</div>;
const Col = ({ children }) => <div style={{ flex: 1 }}>{children}</div>;
const GroupHead = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase",
    color: C.primaryText, margin: "6px 0 10px" }}>{children}</div>
);

function ProjectModal({ categories, initial, onClose, onSave }) {
  const [f, setF] = useState(initial ? { ...blankProject(), ...initial } : blankProject());
  const [showPw, setShowPw] = useState(false);
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setKind = (kind) => {
    const first = categories.find((c) => c.kind === kind);
    setF({ ...f, kind, category: first ? first.name : "" });
  };
  const opts = categories.filter((c) => c.kind === f.kind);

  return (
    <div className="ap-scope" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(6,10,24,.7)",
      display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} className="ap-card"
        style={{ width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", padding: 24, color: C.ink }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.ink }}>{initial ? "Edit project" : "New project"}</h3>
          <IconBtn title="Close" onClick={onClose}><X size={18} color={C.muted} /></IconBtn>
        </div>

        <GroupHead>Project</GroupHead>
        <label style={lbl}>Project name</label>
        <input style={field} value={f.name} onChange={up("name")} placeholder="e.g. Acme Corporate Site" />
        <Row>
          <Col>
            <label style={lbl}>Type</label>
            <select style={field} value={f.kind} onChange={(e) => setKind(e.target.value)}>
              <option value="service">Service</option><option value="micro">Micro-service</option>
            </select>
          </Col>
          <Col>
            <label style={lbl}>Category</label>
            <select style={field} value={f.category} onChange={up("category")}>
              {opts.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
          </Col>
          <Col>
            <label style={lbl}>Status</label>
            <select style={field} value={f.status} onChange={up("status")}>
              <option>Active</option><option>Completed</option><option>On Hold</option>
            </select>
          </Col>
        </Row>
        <label style={lbl}>Requirements</label>
        <textarea style={{ ...field, minHeight: 60, resize: "vertical" }} value={f.requirements} onChange={up("requirements")}
          placeholder="Scope, deliverables, notes on what the client needs..." />

        <GroupHead>Client</GroupHead>
        <Row>
          <Col><label style={lbl}>Client name</label><input style={field} value={f.clientName} onChange={up("clientName")} /></Col>
          <Col><label style={lbl}>Client phone</label><input style={field} value={f.clientPhone} onChange={up("clientPhone")} /></Col>
        </Row>
        <Row>
          <Col><label style={lbl}>Client email</label><input style={field} value={f.clientEmail} onChange={up("clientEmail")} /></Col>
          <Col>
            <label style={lbl}>Email password <span style={{ color: "#F87171" }}>· sensitive</span></label>
            <div style={{ position: "relative" }}>
              <input style={{ ...field, paddingRight: 36 }} type={showPw ? "text" : "password"}
                value={f.clientEmailPassword} onChange={up("clientEmailPassword")} />
              <button type="button" onClick={() => setShowPw((s) => !s)} className="ap-btn"
                style={{ position: "absolute", right: 8, top: 8, border: "none", background: "transparent", cursor: "pointer" }}>
                {showPw ? <EyeOff size={16} color={C.muted} /> : <Eye size={16} color={C.muted} />}
              </button>
            </div>
          </Col>
        </Row>
        <label style={lbl}>Other client info</label>
        <input style={field} value={f.clientOtherInfo} onChange={up("clientOtherInfo")} placeholder="Preferred contact, timezone, etc." />

        <GroupHead>Pricing & Dates</GroupHead>
        <Row>
          <Col><label style={lbl}>Final price (Tk)</label><input style={field} type="number" value={f.finalPrice} onChange={up("finalPrice")} /></Col>
          <Col><label style={lbl}>Amount paid (Tk)</label><input style={field} type="number" value={f.amountPaid} onChange={up("amountPaid")} /></Col>
        </Row>
        <Row>
          <Col><label style={lbl}>Start date</label><input style={field} type="date" value={f.startDate} onChange={up("startDate")} /></Col>
          <Col><label style={lbl}>Delivery date</label><input style={field} type="date" value={f.deliveryDate} onChange={up("deliveryDate")} /></Col>
        </Row>

        <GroupHead>Domain</GroupHead>
        <Row>
          <Col><label style={lbl}>Domain</label><input style={field} value={f.domain} onChange={up("domain")} placeholder="acme.com" /></Col>
          <Col><label style={lbl}>Registrar</label><input style={field} value={f.domainRegistrar} onChange={up("domainRegistrar")} placeholder="Namecheap" /></Col>
        </Row>
        <Row>
          <Col><label style={lbl}>Domain cost (Tk)</label><input style={field} type="number" value={f.domainCost} onChange={up("domainCost")} /></Col>
          <Col><label style={lbl}>Next domain payment</label><input style={field} type="date" value={f.domainRenewal} onChange={up("domainRenewal")} /></Col>
        </Row>

        <GroupHead>Hosting</GroupHead>
        <Row>
          <Col><label style={lbl}>Host provider</label><input style={field} value={f.hostProvider} onChange={up("hostProvider")} placeholder="Vercel" /></Col>
          <Col><label style={lbl}>Hosting cost (Tk)</label><input style={field} type="number" value={f.hostCost} onChange={up("hostCost")} /></Col>
        </Row>
        <label style={lbl}>Next hosting payment</label>
        <input style={field} type="date" value={f.hostRenewal} onChange={up("hostRenewal")} />

        <GroupHead>Upgrade</GroupHead>
        <Row>
          <Col><label style={lbl}>Next upgrade date</label><input style={field} type="date" value={f.nextUpgrade} onChange={up("nextUpgrade")} /></Col>
          <Col><label style={lbl}>Upgrade cost (Tk)</label><input style={field} type="number" value={f.upgradeCost} onChange={up("upgradeCost")} /></Col>
        </Row>
        <label style={lbl}>Upgrade details</label>
        <input style={field} value={f.nextUpgradeInfo} onChange={up("nextUpgradeInfo")} placeholder="e.g. migrate to VPS, bump storage tier" />

        <button className="ap-btn" onClick={() => f.name.trim() && onSave({
          ...f, finalPrice: Number(f.finalPrice) || 0, amountPaid: Number(f.amountPaid) || 0,
          domainCost: Number(f.domainCost) || 0, hostCost: Number(f.hostCost) || 0, upgradeCost: Number(f.upgradeCost) || 0,
        })} style={{ width: "100%", background: C.primary, color: "#fff", border: "none",
          padding: "12px", borderRadius: 10, fontWeight: 600, fontSize: 14, marginTop: 8 }}>
          {initial ? "Save changes" : "Create project"}
        </button>
      </div>
    </div>
  );
}

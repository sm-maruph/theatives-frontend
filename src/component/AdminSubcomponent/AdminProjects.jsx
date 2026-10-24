import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  getProjects, createProject, updateProject, deleteProject,
  getProjectCategories, createProjectCategory, deleteProjectCategory,
} from "../../adminServices/AdminProjectsApi";
import {
  getFinanceCategories, getTransactions, createTransaction, getPayees, createPayee,
  getProjectPayables, createProjectPayable, recordProjectPayablePayment,
} from "../../adminServices/FinanceApi";
import {
  LayoutDashboard, FolderKanban, BellRing, Users2, Tag,
  Plus, Trash2, Pencil, Server, Globe, ArrowUpCircle, TrendingUp,
  CircleCheck, Clock, Search, X, FileSpreadsheet, FileText, Eye, EyeOff,
} from "lucide-react";

/**
 * AdminProjects — dark-themed project-management module for Theatives.
 * Matches the admin dashboard palette (#16213E / #1e293b / #6366f1 / #E94560).
 *
 * Project and category data is loaded from the authenticated Express API.
 * Export deps (loaded lazily on click):
 *   npm install xlsx jspdf jspdf-autotable lucide-react
 */

const TODAY = new Date();
const TODAY_ISO = [TODAY.getFullYear(), String(TODAY.getMonth() + 1).padStart(2, "0"), String(TODAY.getDate()).padStart(2, "0")].join("-");

const blankProject = () => ({
  name: "", category: "Web Development", kind: "service",
  clientName: "", clientEmail: "", clientEmailPassword: "", clientPhone: "",
  clientOtherInfo: "", requirements: "",
  finalPrice: "", amountPaid: "", status: "Active",
  startDate: TODAY_ISO, deliveryDate: "",
  domain: "", domainRegistrar: "", domainCost: "", domainRenewal: "",
  hostProvider: "", hostCost: "", hostRenewal: "",
  nextUpgrade: "", nextUpgradeInfo: "", upgradeCost: "",
  notes: "", updatedAt: TODAY_ISO, updateCount: 0,
});

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
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("All");
  const [kindFilter, setKindFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("delivery");
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectRows, categoryRows] = await Promise.all([getProjects(), getProjectCategories()]);
      setProjects(projectRows);
      setCategories(categoryRows);
      setViewing((current) => current ? projectRows.find((item) => String(item.id) === String(current.id)) || current : null);
    } catch (error) {
      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

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

  const saveProject = async (data) => {
    try {
      if (editing) await updateProject(editing.id, data);
      else await createProject(data);
      setModal(null); setEditing(null);
      await refreshData();
    } catch (error) {
      window.alert(error.message);
    }
  };
  const removeProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
      await refreshData();
    } catch (error) {
      window.alert(error.message);
    }
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
    { key: "payables", label: "People & payables", icon: Users2 },
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

      {loading && <div style={{ color: C.muted, marginBottom: 12 }}>Loading saved projects…</div>}

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
                        <IconBtn title="View project details" onClick={() => setViewing(p)}><Eye size={15} color={C.primaryText} /></IconBtn>
                        <IconBtn title="Client memo (PDF)" onClick={() => generateMemo(p)}><FileText size={15} color={C.muted} /></IconBtn>
                        <IconBtn title="Edit" onClick={() => { setEditing(p); setModal("project"); }}><Pencil size={15} color={C.primaryText} /></IconBtn>
                        <IconBtn title="Delete" onClick={() => removeProject(p.id)}><Trash2 size={15} color="#F87171" /></IconBtn>
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
              onAdd={async (name) => {
                try { await createProjectCategory(name, kind); await refreshData(); }
                catch (error) { window.alert(error.message); }
              }}
              onDelete={async (id) => {
                try { await deleteProjectCategory(id); await refreshData(); }
                catch (error) { window.alert(error.message); }
              }} />
          ))}
        </div>
      )}

      {tab === "payables" && <PayablesPanel projects={projects} />}

      {modal === "project" && (
        <ProjectModal categories={categories} initial={editing}
          onClose={() => { setModal(null); setEditing(null); }} onSave={saveProject} />
      )}
      {viewing && <ProjectDetailsModal project={viewing} onClose={() => setViewing(null)} onRefresh={refreshData} />}
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

function localDateTimeValue() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function ProjectDetailsModal({ project, onClose, onRefresh }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [entry, setEntry] = useState({ transaction_type: "expense", title: "", amount: "", transaction_at: localDateTimeValue(), category_id: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const [allTransactions, allCategories] = await Promise.all([getTransactions(), getFinanceCategories()]);
    setTransactions(allTransactions.filter((item) => String(item.project_id) === String(project.id)));
    setCategories(allCategories);
  }, [project.id]);
  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);
  const availableCategories = categories.filter((item) => item.transaction_type === entry.transaction_type);
  const addEntry = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      if (!entry.title.trim() || Number(entry.amount) <= 0) throw new Error("Enter a title and a positive amount.");
      await createTransaction({ transaction_type: entry.transaction_type, transaction_date: entry.transaction_at.slice(0, 10),
        transaction_at: new Date(entry.transaction_at).toISOString(), amount: Number(entry.amount), currency: "BDT",
        category_id: entry.category_id || null, project_id: project.id, party_name: entry.transaction_type === "income" ? project.clientName : null,
        description: entry.title.trim(), notes: entry.notes || null });
      setEntry((previous) => ({ ...previous, title: "", amount: "", notes: "", transaction_at: localDateTimeValue() }));
      await load(); await onRefresh();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };
  const details = [
    ["Project name", project.name],
    ["Type", project.kind === "micro" ? "Micro-service" : "Service"],
    ["Category", project.category],
    ["Status", project.status],
    ["Start date", project.startDate && fmtDate(project.startDate)],
    ["Delivery date", project.deliveryDate && fmtDate(project.deliveryDate)],
    ["Client", project.clientName],
    ["Client email", project.clientEmail],
    ["Client phone", project.clientPhone],
    ["Other client information", project.clientOtherInfo],
    ["Requirements", project.requirements],
    ["Domain", project.domain],
    ["Domain registrar", project.domainRegistrar],
    ["Domain cost", project.domainCost != null ? taka(project.domainCost) : ""],
    ["Domain renewal", project.domainRenewal && fmtDate(project.domainRenewal)],
    ["Hosting provider", project.hostProvider],
    ["Hosting cost", project.hostCost != null ? taka(project.hostCost) : ""],
    ["Hosting renewal", project.hostRenewal && fmtDate(project.hostRenewal)],
    ["Next upgrade", project.nextUpgrade && fmtDate(project.nextUpgrade)],
    ["Upgrade details", project.nextUpgradeInfo],
    ["Upgrade cost", project.upgradeCost != null ? taka(project.upgradeCost) : ""],
    ["Notes", project.notes],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  const financials = [
    ["Agreed fee", project.finalPrice],
    ["Invoiced", project.invoicedValue],
    ["Received cash", project.amountPaid],
    ["Accounts receivable", project.accountsReceivable],
    ["Project expenses", project.totalProjectExpenses],
    [project.profitLabel || "Current project profit", project.profit],
  ];

  return (
    <div className="ap-scope" onClick={onClose} style={{ position: "fixed", inset: 0,
      background: "rgba(6,10,24,.7)", display: "grid", placeItems: "center", padding: 20, zIndex: 60 }}>
      <div className="ap-card" role="dialog" aria-modal="true" aria-labelledby="project-details-title"
        onClick={(event) => event.stopPropagation()}
        style={{ width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto", padding: 24, color: C.ink }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
          <div>
            <h2 id="project-details-title" style={{ margin: 0, fontSize: 21, color: C.ink }}>{project.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <Pill color={project.kind === "micro" ? "#C084FC" : C.primaryText}
                bg={project.kind === "micro" ? "rgba(192,132,252,.16)" : C.primarySoft}>{project.category}</Pill>
              <StatusPill status={project.status} />
            </div>
          </div>
          <IconBtn title="Close details" onClick={onClose}><X size={18} color={C.muted} /></IconBtn>
        </div>

        <GroupHead>Project finances</GroupHead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 10, marginBottom: 22 }}>
          {financials.map(([label, amount]) => (
            <div key={label} className="ap-card" style={{ padding: 13 }}>
              <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: label === project.profitLabel ? "#34D399" : C.ink }}>
                {taka(amount)}
              </div>
            </div>
          ))}
        </div>

        <GroupHead>Add a cost or client payment</GroupHead>
        <form onSubmit={addEntry} className="ap-card" style={{ padding: 14, marginBottom: 18 }}>
          {error && <div role="alert" style={{ color: "#F87171", fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 9 }}>
            <select style={field} value={entry.transaction_type} onChange={(e) => setEntry({ ...entry, transaction_type: e.target.value, category_id: "" })}>
              <option value="expense">Project cost</option><option value="income">Client payment</option>
            </select>
            <input style={field} required placeholder={entry.transaction_type === "income" ? "Payment installment" : "Developer cost"}
              value={entry.title} onChange={(e) => setEntry({ ...entry, title: e.target.value })} />
            <input style={field} type="number" min="0.01" step="0.01" required placeholder="Amount (BDT)"
              value={entry.amount} onChange={(e) => setEntry({ ...entry, amount: e.target.value })} />
            <input style={field} type="datetime-local" required value={entry.transaction_at}
              onChange={(e) => setEntry({ ...entry, transaction_at: e.target.value })} />
            <select style={field} value={entry.category_id} onChange={(e) => setEntry({ ...entry, category_id: e.target.value })}>
              <option value="">Select category</option>{availableCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <input style={field} placeholder="Notes (optional)" value={entry.notes} onChange={(e) => setEntry({ ...entry, notes: e.target.value })} />
          </div>
          <button className="ap-btn" disabled={saving} style={{ marginTop: 10, background: C.primary, color: "white", border: 0, borderRadius: 8, padding: "9px 15px", fontWeight: 600 }}>
            {saving ? "Saving…" : entry.transaction_type === "income" ? "Add received payment" : "Add project cost"}
          </button>
        </form>

        <GroupHead>Project cost and payment history</GroupHead>
        <div className="ap-card" style={{ overflowX: "auto", marginBottom: 22 }}>
          <table><thead><tr><th>Type</th><th>Title</th><th>Date and time</th><th>Category</th><th>Amount</th></tr></thead>
            <tbody>{transactions.map((item) => <tr key={item.id}>
              <td><Pill color={item.transaction_type === "income" ? "#34D399" : "#FBBF24"} bg={item.transaction_type === "income" ? "rgba(52,211,153,.14)" : "rgba(251,191,36,.14)"}>{item.transaction_type === "income" ? "Received" : "Cost"}</Pill></td>
              <td>{item.description || item.category || "Transaction"}</td>
              <td>{item.transaction_at ? new Date(item.transaction_at).toLocaleString() : fmtDate(item.transaction_date)}</td>
              <td>{item.category || "—"}</td><td style={{ fontWeight: 700 }}>{taka(item.amount)}</td>
            </tr>)}
            {!transactions.length && <tr><td colSpan={5} style={{ textAlign: "center", color: C.muted }}>No project payments or costs recorded yet.</td></tr>}</tbody>
          </table>
        </div>

        <GroupHead>Project and client details</GroupHead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          {details.map(([label, value]) => (
            <div key={label} className="ap-card" style={{ padding: 12 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>{label}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, textAlign: "right", fontSize: 11, color: C.muted }}>
          Updated {project.updatedAt ? fmtDate(project.updatedAt) : "—"} · {project.updateCount || 0} update(s)
        </div>
      </div>
    </div>
  );
}

function PayablesPanel({ projects }) {
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [personForm, setPersonForm] = useState({ name: "", email: "", phone: "" });
  const [payableForm, setPayableForm] = useState({ payee_id: "", project_id: "", title: "", amount_due: "", due_date: "" });
  const [payment, setPayment] = useState({ id: null, amount: "", transaction_at: localDateTimeValue() });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    const [p, obligations] = await Promise.all([getPayees(), getProjectPayables()]);
    setPeople(p); setItems(obligations);
  }, []);
  useEffect(() => { refresh().catch((e) => setError(e.message)); }, [refresh]);
  const run = async (action) => { setBusy(true); setError(""); try { await action(); await refresh(); }
    catch (e) { setError(e.message); } finally { setBusy(false); } };
  const submitPerson = (e) => { e.preventDefault(); run(async () => {
    await createPayee(personForm); setPersonForm({ name: "", email: "", phone: "" });
  }); };
  const submitPayable = (e) => { e.preventDefault(); run(async () => {
    await createProjectPayable({ ...payableForm, amount_due: Number(payableForm.amount_due), due_date: payableForm.due_date || null });
    setPayableForm({ ...payableForm, title: "", amount_due: "", due_date: "" });
  }); };
  const submitPayment = (e) => { e.preventDefault(); run(async () => {
    await recordProjectPayablePayment(payment.id, { amount: Number(payment.amount), transaction_date: payment.transaction_at.slice(0, 10), transaction_at: new Date(payment.transaction_at).toISOString() });
    setPayment({ id: null, amount: "", transaction_at: localDateTimeValue() });
  }); };
  return <div style={{ display: "grid", gap: 16 }}>
    {error && <div role="alert" style={{ color: "#F87171", padding: 12 }}>{error}</div>}
    <div className="ap-card" style={{ padding: 16 }}>
      <SectionHead icon={Users2} title="People and total outstanding" note="A person’s balance includes assignments across every project." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, paddingTop: 14 }}>
        {people.map((person) => <div className="ap-card" key={person.id} style={{ padding: 13 }}>
          <div style={{ fontWeight: 700 }}>{person.name}</div><div style={{ color: C.muted, fontSize: 12 }}>{person.email || person.phone || ""}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12 }}><span>Owed {taka(person.total_amount_due)}</span><span>Paid {taka(person.total_paid)}</span></div>
          <div style={{ color: person.outstanding_balance > 0 ? "#FBBF24" : "#34D399", fontWeight: 700, marginTop: 5 }}>Outstanding {taka(person.outstanding_balance)} · {person.payable_count} project assignment(s)</div>
        </div>)}
        {!people.length && <div style={{ color: C.muted, padding: 8 }}>Add a person to start tracking payables.</div>}
      </div>
    </div>
    <div className="ap-card" style={{ padding: 16 }}>
      <SectionHead icon={Users2} title="Add a person or project payable" />
      <form onSubmit={submitPerson} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8, paddingTop: 14 }}>
        <input style={field} required placeholder="Person name" value={personForm.name} onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })} />
        <input style={field} type="email" placeholder="Email (optional)" value={personForm.email} onChange={(e) => setPersonForm({ ...personForm, email: e.target.value })} />
        <input style={field} placeholder="Phone (optional)" value={personForm.phone} onChange={(e) => setPersonForm({ ...personForm, phone: e.target.value })} />
        <button className="ap-btn" disabled={busy} style={formButton}>Add person</button>
      </form>
      <form onSubmit={submitPayable} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8, paddingTop: 10 }}>
        <select required style={field} value={payableForm.payee_id} onChange={(e) => setPayableForm({ ...payableForm, payee_id: e.target.value })}><option value="">Select person</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <select required style={field} value={payableForm.project_id} onChange={(e) => setPayableForm({ ...payableForm, project_id: e.target.value })}><option value="">Select project</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <input required style={field} placeholder="Work or payable title" value={payableForm.title} onChange={(e) => setPayableForm({ ...payableForm, title: e.target.value })} />
        <input required type="number" min="0.01" step="0.01" style={field} placeholder="Amount due" value={payableForm.amount_due} onChange={(e) => setPayableForm({ ...payableForm, amount_due: e.target.value })} />
        <input type="date" style={field} value={payableForm.due_date} onChange={(e) => setPayableForm({ ...payableForm, due_date: e.target.value })} />
        <button className="ap-btn" disabled={busy} style={formButton}>Assign payable</button>
      </form>
    </div>
    {payment.id && <form className="ap-card" onSubmit={submitPayment} style={{ padding: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <strong style={{ marginRight: 8 }}>Record payment</strong><input required type="number" min="0.01" step="0.01" style={{ ...field, width: 150, margin: 0 }} placeholder="Amount" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} />
      <input required type="datetime-local" style={{ ...field, width: 210, margin: 0 }} value={payment.transaction_at} onChange={(e) => setPayment({ ...payment, transaction_at: e.target.value })} />
      <button className="ap-btn" disabled={busy} style={formButton}>Save payment</button><button type="button" className="ap-btn" onClick={() => setPayment({ id: null, amount: "", transaction_at: localDateTimeValue() })} style={secondaryButton}>Cancel</button>
    </form>}
    <div className="ap-card" style={{ overflowX: "auto" }}><table><thead><tr><th>Person</th><th>Project</th><th>Work</th><th>Owed</th><th>Paid</th><th>Remaining</th><th></th></tr></thead>
      <tbody>{items.map((item) => <tr key={item.id}><td>{item.payee_name}</td><td>{item.project_name}</td><td>{item.title}</td><td>{taka(item.amount_due)}</td><td>{taka(item.paid_amount)}</td><td style={{ color: item.remaining_balance > 0 ? "#FBBF24" : "#34D399", fontWeight: 700 }}>{taka(item.remaining_balance)}</td>
        <td>{item.remaining_balance > 0 && <button className="ap-btn" onClick={() => setPayment({ id: item.id, amount: "", transaction_at: localDateTimeValue() })} style={secondaryButton}>Record payment</button>}</td></tr>)}
        {!items.length && <tr><td colSpan={7} style={{ textAlign: "center", color: C.muted }}>No project payables yet.</td></tr>}</tbody></table></div>
  </div>;
}

const formButton = { background: C.primary, color: "white", border: 0, borderRadius: 8, padding: "9px 13px", fontWeight: 600 };
const secondaryButton = { background: C.primarySoft, color: C.primaryText, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", fontWeight: 600 };


import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, FolderKanban, BellRing, Repeat, Users2,
  Plus, Trash2, Server, Globe, TrendingUp, CircleCheck,
  Clock, Search, X, CalendarClock,
} from "lucide-react";

/**
 * AdminProjects — business operations dashboard for Theatives.
 *
 * Tracks projects, revenue, hosting/domain renewals, and recurring
 * service contracts. Runs on dummy data now; every data source is
 * marked "WIRE API HERE" for when your Supabase/Express backend is ready.
 *
 * To plug into your existing AdminDashboard:
 *   1. import AdminProjects from "./AdminSubcomponent/AdminProjects";
 *   2. add a case "projects": return <AdminProjects />; in renderComponent()
 *   3. add a matching NavItem + DashboardCard.
 *
 * npm install lucide-react   (or swap icons for your existing react-icons)
 */

// ---------------------------------------------------------------------------
// DUMMY DATA  (replace with API calls later)
// ---------------------------------------------------------------------------
const TODAY = new Date("2026-07-08");

const INITIAL_CLIENTS = [
  { id: 1, name: "Nimbus Studio",  contact: "Sarah Ahmed",  email: "sarah@nimbus.co" },
  { id: 2, name: "BrightPixel",    contact: "David Chen",    email: "david@brightpixel.io" },
  { id: 3, name: "Verdant Co.",    contact: "Priya Nair",    email: "priya@verdant.com" },
  { id: 4, name: "Cloudline",      contact: "Rafiq Islam",   email: "rafiq@cloudline.app" },
];

const INITIAL_PROJECTS = [
  {
    id: 1, clientId: 1, name: "Nimbus Corporate Site", type: "Website",
    status: "Active", contractAmount: 180000, startDate: "2025-11-02",
    hostProvider: "Namecheap", hostCost: 9000, hostRenewal: "2026-07-15",
    domain: "nimbus.co", registrar: "Namecheap", domainCost: 1400, domainRenewal: "2026-11-02",
  },
  {
    id: 2, clientId: 2, name: "BrightPixel Store", type: "Web App",
    status: "Active", contractAmount: 420000, startDate: "2026-01-20",
    hostProvider: "Vercel", hostCost: 24000, hostRenewal: "2026-07-11",
    domain: "brightpixel.io", registrar: "GoDaddy", domainCost: 3200, domainRenewal: "2027-01-20",
  },
  {
    id: 3, clientId: 3, name: "Verdant Landing", type: "Website",
    status: "Completed", contractAmount: 95000, startDate: "2025-08-14",
    hostProvider: "Hostinger", hostCost: 7000, hostRenewal: "2026-08-14",
    domain: "verdant.com", registrar: "Hostinger", domainCost: 1600, domainRenewal: "2026-07-22",
  },
  {
    id: 4, clientId: 4, name: "Cloudline Dashboard", type: "Web App",
    status: "On Hold", contractAmount: 310000, startDate: "2026-03-05",
    hostProvider: "DigitalOcean", hostCost: 30000, hostRenewal: "2026-09-05",
    domain: "cloudline.app", registrar: "Namecheap", domainCost: 2100, domainRenewal: "2026-10-05",
  },
];

const INITIAL_CONTRACTS = [
  { id: 1, clientId: 1, service: "Maintenance & Support", cycle: "Monthly",     amount: 15000, nextInvoice: "2026-07-12", status: "Active" },
  { id: 2, clientId: 2, service: "SEO Retainer",          cycle: "Monthly",     amount: 25000, nextInvoice: "2026-07-20", status: "Active" },
  { id: 3, clientId: 3, service: "Hosting Management",    cycle: "Quarterly",   amount: 18000, nextInvoice: "2026-07-25", status: "Active" },
  { id: 4, clientId: 1, service: "Content Updates",       cycle: "Half-Yearly", amount: 40000, nextInvoice: "2026-09-01", status: "Active" },
  { id: 5, clientId: 4, service: "Annual Care Plan",      cycle: "Yearly",      amount: 120000, nextInvoice: "2027-03-05", status: "Paused" },
];
// ---------------------------------------------------------------------------

const taka = (n) => "৳" + Number(n || 0).toLocaleString("en-IN");

const daysUntil = (dateStr) => {
  const d = new Date(dateStr);
  return Math.ceil((d - TODAY) / (1000 * 60 * 60 * 24));
};

const cycleMonths = { Monthly: 1, Quarterly: 3, "Half-Yearly": 6, Yearly: 12 };
const toMonthly = (amount, cycle) => amount / (cycleMonths[cycle] || 1);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// urgency bucket for a renewal
const urgency = (days) => {
  if (days < 0) return { key: "overdue", label: "Overdue", color: "#DC2626", bg: "#FEE2E2" };
  if (days <= 7) return { key: "urgent", label: `${days}d left`, color: "#DC2626", bg: "#FEE2E2" };
  if (days <= 30) return { key: "soon", label: `${days}d left`, color: "#D97706", bg: "#FEF3C7" };
  return { key: "ok", label: `${days}d left`, color: "#059669", bg: "#D1FAE5" };
};

const C = {
  bg: "#F5F6FA", surface: "#FFFFFF", ink: "#1A1D29", muted: "#6B7280",
  border: "#E8EAF0", primary: "#4F46E5", primarySoft: "#EEF0FF",
};

export default function AdminProjects() {
  const [clients] = useState(INITIAL_CLIENTS);          // WIRE API HERE (getClients)
  const [projects, setProjects] = useState(INITIAL_PROJECTS);   // WIRE API HERE (getProjects)
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS); // WIRE API HERE (getContracts)

  const [tab, setTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // "project" | "contract" | null

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "—";

  // ---- derived metrics ----
  const kpis = useMemo(() => {
    const active = projects.filter((p) => p.status === "Active").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const booked = projects.reduce((s, p) => s + p.contractAmount, 0);
    const mrr = contracts
      .filter((c) => c.status === "Active")
      .reduce((s, c) => s + toMonthly(c.amount, c.cycle), 0);
    return { active, completed, booked, mrr };
  }, [projects, contracts]);

  // ---- unified renewal feed (domains + hosting + service invoices) ----
  const renewals = useMemo(() => {
    const items = [];
    projects.forEach((p) => {
      items.push({ id: `d${p.id}`, kind: "Domain", icon: Globe, name: p.domain,
        detail: `${p.registrar} · ${p.name}`, date: p.domainRenewal, cost: p.domainCost });
      items.push({ id: `h${p.id}`, kind: "Hosting", icon: Server, name: p.hostProvider,
        detail: p.name, date: p.hostRenewal, cost: p.hostCost });
    });
    contracts.filter((c) => c.status === "Active").forEach((c) => {
      items.push({ id: `s${c.id}`, kind: "Service", icon: Repeat, name: c.service,
        detail: `${clientName(c.clientId)} · ${c.cycle}`, date: c.nextInvoice, cost: c.amount });
    });
    return items
      .map((i) => ({ ...i, days: daysUntil(i.date) }))
      .sort((a, b) => a.days - b.days);
  }, [projects, contracts]);

  const upcoming = renewals.filter((r) => r.days <= 30);

  const filteredProjects = projects.filter((p) => {
    const okStatus = statusFilter === "All" || p.status === statusFilter;
    const okQuery = (p.name + clientName(p.clientId)).toLowerCase().includes(query.toLowerCase());
    return okStatus && okQuery;
  });

  const deleteProject = (id) => setProjects((p) => p.filter((x) => x.id !== id));
  const deleteContract = (id) => setContracts((c) => c.filter((x) => x.id !== id));

  const tabs = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "renewals", label: "Renewals", icon: BellRing, badge: upcoming.length },
    { key: "contracts", label: "Contracts", icon: Repeat },
    { key: "clients", label: "Clients", icon: Users2 },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100%", padding: 24, color: C.ink,
      fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        .ap-card{background:${C.surface};border:1px solid ${C.border};border-radius:14px;}
        .ap-tab{transition:all .15s ease;}
        .ap-tab:hover{background:${C.primarySoft};}
        .ap-row:hover{background:#FafafC;}
        .ap-btn{transition:all .15s ease;cursor:pointer;}
        .ap-btn:hover{filter:brightness(.94);}
        .ap-icon-btn:hover{background:#FEE2E2;}
        table{border-collapse:collapse;width:100%;}
        th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:${C.muted};
           text-align:left;padding:12px 14px;font-weight:600;}
        td{padding:13px 14px;font-size:13.5px;border-top:1px solid ${C.border};}
      `}</style>

      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Operations</h1>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13.5 }}>
            Projects, renewals & recurring revenue at a glance
          </p>
        </div>
        <button className="ap-btn" onClick={() => setModal("project")}
          style={{ display: "flex", alignItems: "center", gap: 7, background: C.primary,
            color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10,
            fontSize: 13.5, fontWeight: 600 }}>
          <Plus size={16} /> New project
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 22 }}>
        <Kpi icon={FolderKanban} tint="#4F46E5" label="Active projects" value={kpis.active} sub={`${kpis.completed} completed`} />
        <Kpi icon={CircleCheck} tint="#059669" label="Contract value booked" value={taka(kpis.booked)} sub="across all projects" />
        <Kpi icon={TrendingUp} tint="#7C3AED" label="Monthly recurring" value={taka(Math.round(kpis.mrr))} sub="normalized from contracts" />
        <Kpi icon={CalendarClock} tint="#D97706" label="Renewals ≤ 30 days" value={upcoming.length} sub="domain · hosting · service" />
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} className="ap-tab ap-btn" onClick={() => setTab(t.key)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px",
                borderRadius: 10, border: `1px solid ${active ? C.primary : C.border}`,
                background: active ? C.primary : C.surface, color: active ? "#fff" : C.ink,
                fontSize: 13.5, fontWeight: 600 }}>
              <t.icon size={16} /> {t.label}
              {t.badge > 0 && (
                <span style={{ background: active ? "rgba(255,255,255,.25)" : "#FEE2E2",
                  color: active ? "#fff" : "#DC2626", borderRadius: 20, padding: "1px 7px",
                  fontSize: 11, fontWeight: 700 }}>{t.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---- OVERVIEW ---- */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
          <div className="ap-card" style={{ overflow: "hidden" }}>
            <SectionHead icon={BellRing} title="Next renewals" note="Sorted by urgency" />
            <table>
              <thead><tr><th>What</th><th>When</th><th>Cost</th><th>Status</th></tr></thead>
              <tbody>
                {renewals.slice(0, 6).map((r) => {
                  const u = urgency(r.days);
                  return (
                    <tr key={r.id} className="ap-row">
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <r.icon size={15} color={C.muted} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{r.name}</div>
                            <div style={{ fontSize: 12, color: C.muted }}>{r.kind} · {r.detail}</div>
                          </div>
                        </div>
                      </td>
                      <td>{fmtDate(r.date)}</td>
                      <td>{taka(r.cost)}</td>
                      <td><Pill color={u.color} bg={u.bg}>{u.label}</Pill></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="ap-card" style={{ overflow: "hidden" }}>
            <SectionHead icon={FolderKanban} title="Active projects" />
            <div style={{ padding: "4px 0" }}>
              {projects.filter((p) => p.status === "Active").map((p) => (
                <div key={p.id} className="ap-row" style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{clientName(p.clientId)} · {p.type}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{taka(p.contractAmount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- PROJECTS ---- */}
      {tab === "projects" && (
        <div className="ap-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg,
              borderRadius: 9, padding: "7px 11px", flex: 1, minWidth: 200 }}>
              <Search size={15} color={C.muted} />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects or clients"
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13.5, width: "100%" }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "Active", "Completed", "On Hold"].map((s) => (
                <button key={s} className="ap-btn" onClick={() => setStatusFilter(s)}
                  style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                    border: `1px solid ${statusFilter === s ? C.primary : C.border}`,
                    background: statusFilter === s ? C.primarySoft : C.surface,
                    color: statusFilter === s ? C.primary : C.muted }}>{s}</button>
              ))}
            </div>
          </div>
          <table>
            <thead>
              <tr><th>Project</th><th>Client</th><th>Type</th><th>Value</th>
                <th>Hosting</th><th>Domain</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id} className="ap-row">
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{clientName(p.clientId)}</td>
                  <td>{p.type}</td>
                  <td style={{ fontWeight: 600 }}>{taka(p.contractAmount)}</td>
                  <td style={{ fontSize: 12.5, color: C.muted }}>{p.hostProvider}</td>
                  <td style={{ fontSize: 12.5, color: C.muted }}>{p.domain}</td>
                  <td><StatusPill status={p.status} /></td>
                  <td>
                    <button className="ap-icon-btn ap-btn" onClick={() => deleteProject(p.id)}
                      title="Delete" style={{ border: "none", background: "transparent",
                        padding: 6, borderRadius: 7, display: "grid", placeItems: "center" }}>
                      <Trash2 size={15} color="#DC2626" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", color: C.muted, padding: 28 }}>
                  No projects match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ---- RENEWALS ---- */}
      {tab === "renewals" && (
        <div className="ap-card" style={{ overflow: "hidden" }}>
          <SectionHead icon={BellRing} title="All renewals"
            note="Domains, hosting & service invoices — soonest first" />
          <table>
            <thead><tr><th>Item</th><th>Type</th><th>Due</th><th>Cost</th><th>Status</th></tr></thead>
            <tbody>
              {renewals.map((r) => {
                const u = urgency(r.days);
                return (
                  <tr key={r.id} className="ap-row">
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <r.icon size={15} color={C.muted} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{r.detail}</div>
                        </div>
                      </div>
                    </td>
                    <td>{r.kind}</td>
                    <td>{fmtDate(r.date)}</td>
                    <td>{taka(r.cost)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {u.key !== "ok" && <Clock size={13} color={u.color} />}
                        <Pill color={u.color} bg={u.bg}>{u.label}</Pill>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ---- CONTRACTS ---- */}
      {tab === "contracts" && (
        <div className="ap-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
            <SectionHead icon={Repeat} title="Recurring services" inline />
            <button className="ap-btn" onClick={() => setModal("contract")}
              style={{ display: "flex", alignItems: "center", gap: 6, background: C.primarySoft,
                color: C.primary, border: "none", padding: "8px 13px", borderRadius: 9,
                fontSize: 13, fontWeight: 600 }}>
              <Plus size={15} /> New contract
            </button>
          </div>
          <table>
            <thead>
              <tr><th>Service</th><th>Client</th><th>Cycle</th><th>Amount</th>
                <th>Per month</th><th>Next invoice</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="ap-row">
                  <td style={{ fontWeight: 600 }}>{c.service}</td>
                  <td>{clientName(c.clientId)}</td>
                  <td><Pill color={C.primary} bg={C.primarySoft}>{c.cycle}</Pill></td>
                  <td style={{ fontWeight: 600 }}>{taka(c.amount)}</td>
                  <td style={{ color: C.muted }}>{taka(Math.round(toMonthly(c.amount, c.cycle)))}</td>
                  <td>{fmtDate(c.nextInvoice)}</td>
                  <td><StatusPill status={c.status} /></td>
                  <td>
                    <button className="ap-icon-btn ap-btn" onClick={() => deleteContract(c.id)}
                      style={{ border: "none", background: "transparent", padding: 6,
                        borderRadius: 7, display: "grid", placeItems: "center" }}>
                      <Trash2 size={15} color="#DC2626" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---- CLIENTS ---- */}
      {tab === "clients" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {clients.map((cl) => {
            const cProjects = projects.filter((p) => p.clientId === cl.id);
            const total = cProjects.reduce((s, p) => s + p.contractAmount, 0);
            const recurring = contracts.filter((c) => c.clientId === cl.id && c.status === "Active").length;
            return (
              <div key={cl.id} className="ap-card" style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primarySoft,
                    color: C.primary, display: "grid", placeItems: "center", fontWeight: 700 }}>
                    {cl.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{cl.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{cl.contact}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: C.muted }}>Projects</span><span style={{ fontWeight: 600 }}>{cProjects.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: C.muted }}>Recurring services</span><span style={{ fontWeight: 600 }}>{recurring}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13,
                  paddingTop: 10, marginTop: 6, borderTop: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted }}>Total value</span>
                  <span style={{ fontWeight: 700, color: C.primary }}>{taka(total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal === "project" && (
        <ProjectModal clients={clients} onClose={() => setModal(null)}
          onSave={(p) => { setProjects((prev) => [...prev, { ...p, id: Date.now() }]); setModal(null); }} />
      )}
      {modal === "contract" && (
        <ContractModal clients={clients} onClose={() => setModal(null)}
          onSave={(c) => { setContracts((prev) => [...prev, { ...c, id: Date.now() }]); setModal(null); }} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------
function Kpi({ icon: Icon, tint, label, value, sub }) {
  return (
    <div className="ap-card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, margin: "6px 0 2px" }}>{value}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: tint + "18",
          display: "grid", placeItems: "center" }}>
          <Icon size={19} color={tint} />
        </div>
      </div>
    </div>
  );
}

function SectionHead({ icon: Icon, title, note, inline }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9,
      padding: inline ? 0 : "15px 16px 13px", borderBottom: inline ? "none" : `1px solid ${C.border}` }}>
      <Icon size={17} color={C.primary} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{title}</div>
        {note && <div style={{ fontSize: 12, color: C.muted }}>{note}</div>}
      </div>
    </div>
  );
}

const Pill = ({ children, color, bg }) => (
  <span style={{ background: bg, color, padding: "3px 9px", borderRadius: 20,
    fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>
);

function StatusPill({ status }) {
  const map = {
    Active: ["#059669", "#D1FAE5"], Completed: ["#4F46E5", "#EEF0FF"],
    "On Hold": ["#D97706", "#FEF3C7"], Paused: ["#6B7280", "#F3F4F6"],
  };
  const [color, bg] = map[status] || ["#6B7280", "#F3F4F6"];
  return <Pill color={color} bg={bg}>{status}</Pill>;
}

// ---------------------------------------------------------------------------
// Modals  (local state only — hook onSave up to your API later)
// ---------------------------------------------------------------------------
function Shell({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,20,35,.45)",
      display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} className="ap-card"
        style={{ width: "100%", maxWidth: 460, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button className="ap-btn" onClick={onClose}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            <X size={18} color={C.muted} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const field = { width: "100%", padding: "9px 11px", borderRadius: 9, border: `1px solid ${C.border}`,
  fontSize: 13.5, outline: "none", marginBottom: 12, boxSizing: "border-box" };
const lbl = { fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 };

function ProjectModal({ clients, onClose, onSave }) {
  const [f, setF] = useState({ name: "", clientId: clients[0]?.id, type: "Website",
    status: "Active", contractAmount: "", hostProvider: "", hostRenewal: "",
    domain: "", registrar: "", domainRenewal: "", hostCost: 0, domainCost: 0, startDate: "2026-07-08" });
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Shell title="New project" onClose={onClose}>
      <label style={lbl}>Project name</label>
      <input style={field} value={f.name} onChange={up("name")} placeholder="e.g. Acme Corporate Site" />
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Client</label>
          <select style={field} value={f.clientId} onChange={up("clientId")}>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Type</label>
          <select style={field} value={f.type} onChange={up("type")}>
            <option>Website</option><option>Web App</option><option>Mobile App</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Contract value (৳)</label>
          <input style={field} type="number" value={f.contractAmount} onChange={up("contractAmount")} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Status</label>
          <select style={field} value={f.status} onChange={up("status")}>
            <option>Active</option><option>Completed</option><option>On Hold</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Domain</label>
          <input style={field} value={f.domain} onChange={up("domain")} placeholder="acme.com" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Domain renewal</label>
          <input style={field} type="date" value={f.domainRenewal} onChange={up("domainRenewal")} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Hosting provider</label>
          <input style={field} value={f.hostProvider} onChange={up("hostProvider")} placeholder="Vercel" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Hosting renewal</label>
          <input style={field} type="date" value={f.hostRenewal} onChange={up("hostRenewal")} />
        </div>
      </div>
      <button className="ap-btn" onClick={() => f.name && onSave({ ...f,
        contractAmount: Number(f.contractAmount) || 0, registrar: f.registrar || "—" })}
        style={{ width: "100%", background: C.primary, color: "#fff", border: "none",
          padding: "11px", borderRadius: 10, fontWeight: 600, fontSize: 14, marginTop: 4 }}>
        Save project
      </button>
    </Shell>
  );
}

function ContractModal({ clients, onClose, onSave }) {
  const [f, setF] = useState({ service: "", clientId: clients[0]?.id, cycle: "Monthly",
    amount: "", nextInvoice: "2026-08-01", status: "Active" });
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Shell title="New contract" onClose={onClose}>
      <label style={lbl}>Service</label>
      <input style={field} value={f.service} onChange={up("service")} placeholder="e.g. Maintenance & Support" />
      <label style={lbl}>Client</label>
      <select style={field} value={f.clientId} onChange={up("clientId")}>
        {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Billing cycle</label>
          <select style={field} value={f.cycle} onChange={up("cycle")}>
            <option>Monthly</option><option>Quarterly</option>
            <option>Half-Yearly</option><option>Yearly</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Amount (৳)</label>
          <input style={field} type="number" value={f.amount} onChange={up("amount")} />
        </div>
      </div>
      <label style={lbl}>Next invoice date</label>
      <input style={field} type="date" value={f.nextInvoice} onChange={up("nextInvoice")} />
      <button className="ap-btn" onClick={() => f.service && onSave({ ...f, amount: Number(f.amount) || 0 })}
        style={{ width: "100%", background: C.primary, color: "#fff", border: "none",
          padding: "11px", borderRadius: 10, fontWeight: 600, fontSize: 14, marginTop: 4 }}>
        Save contract
      </button>
    </Shell>
  );
}

import React, { useState, useEffect } from "react";
import "../css/ServiceInquiry.css";
import { createInquiry } from "../../adminServices/serviceInquiryApi";

/**
 * ServiceInquiryModal
 * Put this in: src/component/subComponentService/ServiceInquiryModal.jsx
 *
 * Opened by the "Get Service" button on a service or micro-service card.
 * The chosen service is passed in and shown read-only, so the customer
 * can't mistype what they clicked — it's captured exactly.
 *
 * Props:
 *   service : { id, title, image_path }   the card that was clicked
 *   kind    : "service" | "micro"
 *   onClose : () => void
 */

const BUDGETS = [
  "Under ৳25,000",
  "৳25,000 – ৳75,000",
  "৳75,000 – ৳2,00,000",
  "৳2,00,000 – ৳5,00,000",
  "Above ৳5,00,000",
  "Not sure yet",
];

const CONTACT_PREFS = ["Email", "Phone", "WhatsApp"];

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export default function ServiceInquiryModal({ service, kind, onClose }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    deadline: "",
    contact_pref: "Email",
    requirements: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const up = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: null });
  };

  // Esc closes the modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // lock page scroll
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Please tell us your name";
    if (!f.email.trim()) e.email = "We need an email to reply";
    else if (!emailOk(f.email)) e.email = "That email doesn't look right";
    if (!f.requirements.trim()) e.requirements = "Describe what you need";
    else if (f.requirements.trim().length < 15)
      e.requirements = "A little more detail helps us quote accurately";
    if (f.contact_pref !== "Email" && !f.phone.trim())
      e.phone = "Add a number so we can reach you";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setStatus("sending");
    try {
      await createInquiry({
        service_id: service.id ?? null,
        service_title: service.title,
        service_kind: kind,
        ...f,
        name: f.name.trim(),
        email: f.email.trim(),
        requirements: f.requirements.trim(),
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
    }
  };

  const kindLabel = kind === "service" ? "Service" : "Micro-service";

  return (
    <div className="svm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`svm-modal ${kind === "micro" ? "svm-modal--micro" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="svm-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {status === "done" ? (
          /* ---------- Success state ---------- */
          <div className="svm-success">
            <div className="svm-success-ring">
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                <path
                  d="M4 12.5l5 5L20 6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Request received</h3>
            <p>
              Thanks, {f.name.split(" ")[0]}. We've logged your interest in{" "}
              <strong>{service.title}</strong> and will get back to you at{" "}
              <strong>{f.email}</strong> within one business day.
            </p>
            <button className="svm-btn svm-btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ---------- Header: the auto-captured service ---------- */}
            <div className="svm-head">
              <span className="svm-kind">{kindLabel}</span>
              <h3 className="svm-title">Request: {service.title}</h3>
              <p className="svm-sub">
                Fill this in and we'll come back with a scope and a quote.
              </p>
            </div>

            <div className="svm-selected">
              {service.image_path && (
                <img src={service.image_path} alt="" className="svm-selected-img" />
              )}
              <div>
                <div className="svm-selected-label">Selected service</div>
                <div className="svm-selected-name">{service.title}</div>
              </div>
              <span className="svm-lock" title="Auto-filled from the card you clicked">
                Auto-filled
              </span>
            </div>

            {/* ---------- Customer fields ---------- */}
            <div className="svm-grid">
              <div className="svm-field">
                <label>Your name *</label>
                <input
                  value={f.name}
                  onChange={up("name")}
                  placeholder="Full name"
                  className={errors.name ? "svm-invalid" : ""}
                />
                {errors.name && <span className="svm-err">{errors.name}</span>}
              </div>

              <div className="svm-field">
                <label>Email *</label>
                <input
                  type="email"
                  value={f.email}
                  onChange={up("email")}
                  placeholder="you@company.com"
                  className={errors.email ? "svm-invalid" : ""}
                />
                {errors.email && <span className="svm-err">{errors.email}</span>}
              </div>

              <div className="svm-field">
                <label>Phone {f.contact_pref !== "Email" && "*"}</label>
                <input
                  value={f.phone}
                  onChange={up("phone")}
                  placeholder="+880 1XXX-XXXXXX"
                  className={errors.phone ? "svm-invalid" : ""}
                />
                {errors.phone && <span className="svm-err">{errors.phone}</span>}
              </div>

              <div className="svm-field">
                <label>Company / brand</label>
                <input
                  value={f.company}
                  onChange={up("company")}
                  placeholder="Optional"
                />
              </div>

              <div className="svm-field">
                <label>Budget range</label>
                <select value={f.budget} onChange={up("budget")}>
                  <option value="">Select a range</option>
                  {BUDGETS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="svm-field">
                <label>Needed by</label>
                <input type="date" value={f.deadline} onChange={up("deadline")} />
              </div>
            </div>

            <div className="svm-field">
              <label>Preferred contact</label>
              <div className="svm-pills">
                {CONTACT_PREFS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`svm-pill ${f.contact_pref === c ? "is-on" : ""}`}
                    onClick={() => setF({ ...f, contact_pref: c })}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="svm-field">
              <label>What do you need? *</label>
              <textarea
                rows={4}
                value={f.requirements}
                onChange={up("requirements")}
                placeholder="Tell us about the project, your goals, references you like, anything that helps us understand the scope."
                className={errors.requirements ? "svm-invalid" : ""}
              />
              {errors.requirements && (
                <span className="svm-err">{errors.requirements}</span>
              )}
            </div>

            {status === "error" && (
              <div className="svm-banner">
                Something went wrong sending that. Please try again.
              </div>
            )}

            <div className="svm-actions">
              <button className="svm-btn" onClick={onClose} disabled={status === "sending"}>
                Cancel
              </button>
              <button
                className="svm-btn svm-btn--primary"
                onClick={submit}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send request"}
              </button>
            </div>

            <p className="svm-note">
              We only use these details to respond to your request.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState, type FormEvent } from "react";
import { Send } from "lucide-react";

const FORMSPREE_ID = "mppqnzza";

type Status = "idle" | "sending" | "sent" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    if (status !== "sent") return;
    const t = window.setTimeout(() => setDelivered(true), 1100);
    return () => window.clearTimeout(t);
  }, [status]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (delivered) {
    return (
      <div className="lead-done" role="status">
        <svg className="done-check" viewBox="0 0 64 64" aria-hidden="true">
          <circle className="done-circle" cx="32" cy="32" r="28" />
          <path className="done-tick" d="M20 33 L29 42 L45 24" />
        </svg>
        <p className="lead-done-title">Delivered.</p>
        <p className="lead-done-text">
          Your brief is in my inbox — I read everything myself, expect a reply
          within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <input type="hidden" name="_subject" value="New lead from portfolio" />
      <input type="text" name="_gotcha" className="lead-honeypot" tabIndex={-1} autoComplete="off" />
      <div className="lead-row">
        <label className="field">
          <span className="field-label">Name *</span>
          <input className="field-input" type="text" name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span className="field-label">Email *</span>
          <input className="field-input" type="email" name="email" required autoComplete="email" />
        </label>
      </div>
      <div className="lead-row">
        <label className="field">
          <span className="field-label">Company</span>
          <input className="field-input" type="text" name="company" autoComplete="organization" />
        </label>
        <label className="field">
          <span className="field-label">Project type</span>
          <select className="field-input" name="project_type" defaultValue="New website">
            <option>New website</option>
            <option>Website redesign</option>
            <option>SEO</option>
            <option>Web application</option>
            <option>Something else</option>
          </select>
        </label>
      </div>
      <div className="lead-row">
        <label className="field">
          <span className="field-label">Budget</span>
          <select className="field-input" name="budget" defaultValue="Let's discuss">
            <option>Under $500</option>
            <option>$500 – $2,000</option>
            <option>$2,000 – $5,000</option>
            <option>$5,000+</option>
            <option>Let&apos;s discuss</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Timeline</span>
          <select className="field-input" name="timeline" defaultValue="Flexible">
            <option>ASAP</option>
            <option>Within a month</option>
            <option>2–3 months</option>
            <option>Flexible</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span className="field-label">Project details *</span>
        <textarea
          className="field-input field-area"
          name="message"
          required
          rows={5}
          placeholder="What are you building, and what does success look like?"
        />
      </label>
      {status === "error" && (
        <p className="lead-error" role="alert">
          Something went wrong sending that — try the email button above instead.
        </p>
      )}
      <button
        type="submit"
        className={`btn btn-primary btn-lg lead-submit is-${status}`}
        disabled={status !== "idle"}
        data-cursor="SEND"
      >
        {status === "sending" ? (
          <>
            <span className="lead-spinner" aria-hidden="true" />
            <span>Sending…</span>
          </>
        ) : status === "sent" ? (
          <>
            <Send size={16} className="lead-plane" aria-hidden="true" />
            <span>Delivered</span>
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            <span>Send the brief</span>
          </>
        )}
      </button>
    </form>
  );
}

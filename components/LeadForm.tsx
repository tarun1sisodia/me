"use client";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

const FORMSPREE_ID = "YOUR_FORM_ID";

type Status = "idle" | "sending" | "sent" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
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

  if (status === "sent") {
    return (
      <div className="lead-done" role="status">
        <p className="lead-done-title">Message received.</p>
        <p className="lead-done-text">
          I read everything myself — expect a reply within 24 hours.
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
        className="btn btn-primary btn-lg lead-submit"
        disabled={status === "sending"}
        data-cursor="SEND"
      >
        <Send size={16} aria-hidden="true" />
        {status === "sending" ? "Sending…" : "Send the brief"}
      </button>
    </form>
  );
}

"use client";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";

export default function MiniNav() {
  return (
    <nav className="mini-nav" aria-label="Quick navigation">
      <Magnetic>
        <a href="#work" className="btn btn-primary btn-sm">
          View work <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </Magnetic>
      <Magnetic>
        <a href="#connect" className="btn btn-ghost btn-sm">
          Connect
        </a>
      </Magnetic>
    </nav>
  );
}

import React from "react";

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

export function NoLoginIcon({ className = "h-7 w-7" }) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.5 6.5 21 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 6.5 17.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LoginIcon({ className = "h-7 w-7" }) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16.5 3.5h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m20.5 3.5-3.2 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ExitLoginIcon({ className = "h-7 w-7" }) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="9.5" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 12h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m18.5 9 3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

export function NoLoginIcon({ className = "h-7 w-7" }) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#F3F4F6" />
      <circle cx="12" cy="8.5" r="3" fill="#6B7280" />
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LoginIcon({ className = "h-7 w-7" }) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#DCFCE7" />
      <circle cx="12" cy="8.5" r="3" fill="#166534" />
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
      <path d="m16.2 4.8 1.6 1.6 2.6-2.6" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExitLoginIcon({ className = "h-7 w-7" }) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#FEE2E2" />
      <circle cx="9.5" cy="8.5" r="3" fill="#991B1B" />
      <path d="M4.5 18a5.5 5.5 0 0 1 10.5 0" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
      <path d="M13.8 12h6" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
      <path d="m17.2 9.8 2.2 2.2-2.2 2.2" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

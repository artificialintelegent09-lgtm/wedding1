/** A hairline gold rule with a diamond heart. Purely decorative. */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 24"
      className={`mx-auto h-5 w-56 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="gd-l" x1="0" x2="1">
          <stop offset="0" stopColor="#c9a45c" stopOpacity="0" />
          <stop offset="1" stopColor="#c9a45c" />
        </linearGradient>
        <linearGradient id="gd-r" x1="1" x2="0">
          <stop offset="0" stopColor="#c9a45c" stopOpacity="0" />
          <stop offset="1" stopColor="#c9a45c" />
        </linearGradient>
      </defs>
      <path d="M0 12H104" stroke="url(#gd-l)" strokeWidth="1" />
      <path d="M156 12H260" stroke="url(#gd-r)" strokeWidth="1" />
      <path d="M130 3l9 9-9 9-9-9z" fill="none" stroke="#c9a45c" strokeWidth="1" />
      <path d="M130 7.5l4.5 4.5-4.5 4.5-4.5-4.5z" fill="#c9a45c" />
      <circle cx="108" cy="12" r="1.6" fill="#c9a45c" />
      <circle cx="152" cy="12" r="1.6" fill="#c9a45c" />
      <circle cx="98" cy="12" r="1" fill="#c9a45c" opacity=".6" />
      <circle cx="162" cy="12" r="1" fill="#c9a45c" opacity=".6" />
    </svg>
  );
}

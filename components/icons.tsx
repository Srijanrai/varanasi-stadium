// Small stroke icon set (24px grid, currentColor). Kept in-house to avoid an icon dependency.
type P = { className?: string };
const base = (className = "h-5 w-5") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconStadium = ({ className }: P) => (
  <svg {...base(className)}>
    <ellipse cx="12" cy="8" rx="9" ry="3.5" />
    <path d="M3 8v7c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5V8M8 11.2v7M16 11.2v7" />
  </svg>
);
export const IconBed = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" />
    <circle cx="7" cy="10.5" r="1.8" />
  </svg>
);
export const IconTemple = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 2v2M8 9l4-5 4 5M6 13l6-4 6 4M4 21V13h16v8M10 21v-4h4v4" />
  </svg>
);
export const IconWaves = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M2 8c2 0 2-1.5 4-1.5S8 8 10 8s2-1.5 4-1.5S16 8 18 8s2-1.5 4-1.5M2 13c2 0 2-1.5 4-1.5S8 13 10 13s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
  </svg>
);
export const IconHospital = ({ className }: P) => (
  <svg {...base(className)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);
export const IconBus = ({ className }: P) => (
  <svg {...base(className)}>
    <rect x="4" y="3" width="16" height="14" rx="3" />
    <path d="M4 11h16M7.5 20v-3M16.5 20v-3" />
    <circle cx="8" cy="14" r=".6" fill="currentColor" />
    <circle cx="16" cy="14" r=".6" fill="currentColor" />
  </svg>
);
export const IconSearch = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const IconPin = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconHome = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
export const IconCompass = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
);
export const IconRoute = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <path d="M8.5 18H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5" />
  </svg>
);
export const IconTicket = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 8a2 2 0 0 0 0 4v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4a2 2 0 0 1 0-4V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" transform="translate(0 1)" />
    <path d="M14 6v12" strokeDasharray="2 2" />
  </svg>
);
export const IconCalendar = ({ className }: P) => (
  <svg {...base(className)}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const IconCrane = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M6 21V4l14 3M6 7h14M6 4 3 7h3M17 7v5M15.5 12h3v2.5h-3zM3 21h8" />
  </svg>
);
export const IconClock = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconCheck = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);
export const IconAlert = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 3 2.5 20h19z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);
export const IconChevron = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const IconPhone = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const IconDirections = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="m12 2 10 10-10 10L2 12z" />
    <path d="M9 14v-2.5a1.5 1.5 0 0 1 1.5-1.5H15m-2-2 2 2-2 2" />
  </svg>
);
export const IconMenu = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IconClose = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlane = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M10.5 13.5 3 11l1.5-1.5 8 .5 4-4.5a2 2 0 0 1 3 3L15 12.5l.5 8L14 22l-2.5-7.5-3 3V20L7 21l-1-3-3-1 1-1.5h2.5z" />
  </svg>
);

export const CATEGORY_ICONS = {
  hotel: IconBed,
  temple: IconTemple,
  ghat: IconWaves,
  hospital: IconHospital,
  transport: IconBus,
} as const;

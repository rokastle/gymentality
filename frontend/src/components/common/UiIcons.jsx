const BaseIcon = ({ children, className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const ProfileIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="8" r="4" />
  </BaseIcon>
);

export const ArrowRightIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </BaseIcon>
);

export const CommitmentIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <circle cx="8.5" cy="16.5" r="2.5" />
    <path d="M14 14l4 5" />
  </BaseIcon>
);

export const GuidedClassesIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <circle cx="9" cy="7" r="3" />
    <path d="M4 20v-2a5 5 0 0 1 10 0v2" />
    <circle cx="18" cy="9" r="2" />
    <path d="M15 20v-1a4 4 0 0 1 4-4h1" />
  </BaseIcon>
);

export const EquipmentIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <path d="M3 10v4" />
    <path d="M6 8v8" />
    <path d="M18 8v8" />
    <path d="M21 10v4" />
    <path d="M6 12h12" />
  </BaseIcon>
);

export const PersonalTrainingIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v6" />
    <path d="M8 21v-4a4 4 0 0 1 8 0v4" />
    <path d="M7 11l5 2 5-2" />
  </BaseIcon>
);

export const InstagramIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
  </BaseIcon>
);

export const XIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <path d="M5 5l14 14" />
    <path d="M19 5L5 19" />
  </BaseIcon>
);

export const YouTubeIcon = ({ className = "" }) => (
  <BaseIcon className={className}>
    <path d="M22 12s0-4-1-5.5c-.6-.9-1.3-1.2-2.2-1.3C16.9 5 12 5 12 5s-4.9 0-6.8.2c-.9.1-1.6.4-2.2 1.3C2 8 2 12 2 12s0 4 1 5.5c.6.9 1.3 1.2 2.2 1.3C7.1 19 12 19 12 19s4.9 0 6.8-.2c.9-.1 1.6-.4 2.2-1.3 1-1.5 1-5.5 1-5.5z" />
    <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
  </BaseIcon>
);
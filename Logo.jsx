/* Stylized location pin with upward trend — "real estate data" in one mark */
export function LogoIcon({ size=36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="#10b981"/>
      {/* House silhouette */}
      <path d="M18 8L9 15.5V27H15V21H21V27H27V15.5L18 8Z" fill="white" opacity="0.3"/>
      {/* Upward trend line */}
      <path d="M10 24L14.5 19L18 21.5L22 15L26 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Trend arrow */}
      <path d="M23 11H26V14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Dot accent */}
      <circle cx="14.5" cy="19" r="1.5" fill="white"/>
      <circle cx="18" cy="21.5" r="1.5" fill="white"/>
      <circle cx="22" cy="15" r="1.5" fill="white"/>
    </svg>
  );
}

export function LogoIconSmall({ size=20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="#10b981"/>
      <path d="M10 24L14.5 19L18 21.5L22 15L26 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 11H26V14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

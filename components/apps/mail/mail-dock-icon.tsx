"use client";

interface MailDockIconProps {
  size?: number;
}

export function MailDockIcon({ size = 48 }: MailDockIconProps) {
  const borderRadius = Math.round(size * 0.22);

  return (
    <div
      className="relative overflow-hidden shadow-md"
      style={{
        width: size,
        height: size,
        borderRadius,
        background: "linear-gradient(170deg, #2196f3 0%, #0A7CFF 60%, #0060e0 100%)",
      }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Envelope body */}
        <rect x="7" y="14" width="34" height="22" rx="3" fill="white" />
        {/* Envelope flap V-fold */}
        <path
          d="M7 14 L24 27 L41 14"
          fill="none"
          stroke="#0A7CFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

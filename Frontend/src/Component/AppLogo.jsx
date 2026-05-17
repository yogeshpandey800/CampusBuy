import React from "react";

/**
 * MMMUT Buy & Sell — inline SVG logo.
 * A shopping bag with a graduation cap on top, representing a campus marketplace.
 * Uses indigo/purple brand colours that match the app's theme.
 */
const AppLogo = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="MMMUT Buy & Sell logo"
  >
    {/* Background circle */}
    <circle cx="32" cy="32" r="32" fill="url(#bgGrad)" />

    {/* Shopping bag body */}
    <rect x="16" y="28" width="32" height="22" rx="4" fill="white" fillOpacity="0.95" />

    {/* Bag handle */}
    <path
      d="M24 28 C24 22 28 18 32 18 C36 18 40 22 40 28"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />

    {/* Rupee symbol on bag */}
    <text
      x="32"
      y="44"
      textAnchor="middle"
      fontSize="14"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      fill="url(#textGrad)"
    >
      ₹
    </text>

    {/* Graduation cap — flat board */}
    <polygon points="32,8 44,14 32,20 20,14" fill="white" fillOpacity="0.95" />
    {/* Cap top knob */}
    <circle cx="32" cy="8" r="2" fill="white" fillOpacity="0.8" />
    {/* Tassel string */}
    <line x1="44" y1="14" x2="44" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="44" cy="21" r="1.5" fill="white" fillOpacity="0.8" />

    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="textGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
  </svg>
);

export default AppLogo;

import React from 'react';
import { ArtworkKind } from '../types';

export const IoTHomeLogoMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 18.5L20 6L35 18.5"
      stroke="#0F52BA"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 15V31C10 32.1046 10.8954 33 12 33H28C29.1046 33 30 32.1046 30 31V15"
      stroke="#0F52BA"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 21.5C17.5 18.5 22.5 18.5 25.5 21.5"
      stroke="#1D63DC"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <path
      d="M17.2 24.8C18.8 23.2 21.2 23.2 22.8 24.8"
      stroke="#1D63DC"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <circle cx="20" cy="28" r="1.8" fill="#0F52BA" />
  </svg>
);

interface ProductArtworkProps {
  kind: ArtworkKind;
  isActive?: boolean;
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  kind,
  isActive = true,
  className = 'w-full h-full',
}) => {
  switch (kind) {
    case 'bulb':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="38%" r="48%">
              <stop offset="0%" stopColor={isActive ? '#FDE68A' : '#E2E8F0'} stopOpacity={isActive ? '0.85' : '0.4'} />
              <stop offset="65%" stopColor={isActive ? '#F59E0B' : '#CBD5E1'} stopOpacity="0.15" />
              <stop offset="100%" stopColor="#F1F5F9" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bulbGlass" x1="88" y1="30" x2="152" y2="112" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isActive ? '#FFFBEB' : '#FFFFFF'} />
              <stop offset="100%" stopColor={isActive ? '#FCD34D' : '#E2E8F0'} />
            </linearGradient>
          </defs>
          <circle cx="120" cy="72" r="68" fill="url(#bulbGlow)" />
          <path
            d="M120 30C97.9086 30 80 47.9086 80 70C80 84.5 87.8 97.1 99.5 104.2C102.3 105.9 104 108.9 104 112.2V118H136V112.2C136 108.9 137.7 105.9 140.5 104.2C152.2 97.1 160 84.5 160 70C160 47.9086 142.091 30 120 30Z"
            fill="url(#bulbGlass)"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          <rect x="103" y="116" width="34" height="12" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="106" y="128" width="28" height="16" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <path d="M107 134H133M107 139H133" stroke="#64748B" strokeWidth="1.5" />
          <path d="M112 144H128L124 150H116L112 144Z" fill="#475569" />
          <path d="M113 78C113 71 116 66 120 66C124 66 127 71 127 78" stroke="#0F52BA" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="120" cy="84" r="2.2" fill="#0F52BA" />
        </svg>
      );

    case 'cctv':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="146" rx="46" ry="8" fill="#CBD5E1" fillOpacity="0.6" />
          <path
            d="M84 128C84 121.373 89.3726 116 96 116H144C150.627 116 156 121.373 156 128V140C156 143.314 153.314 146 150 146H90C86.6863 146 84 143.314 84 140V128Z"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="1.8"
          />
          <rect x="102" y="106" width="36" height="12" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="120" cy="72" r="42" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="120" cy="72" r="30" fill="#0F172A" />
          <circle cx="120" cy="72" r="21" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <circle cx="120" cy="72" r="10" fill="#0F52BA" fillOpacity="0.7" />
          <circle cx="120" cy="72" r="4.5" fill="#020617" />
          <circle cx="115" cy="67" r="2.5" fill="#FFFFFF" fillOpacity="0.7" />
          <circle cx="120" cy="48" r="2.5" fill={isActive ? '#16A34A' : '#64748B'} />
          <rect x="108" y="131" width="24" height="3" rx="1.5" fill="#0F52BA" fillOpacity="0.45" />
        </svg>
      );

    case 'plug':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="144" rx="40" ry="7" fill="#CBD5E1" fillOpacity="0.55" />
          <rect x="74" y="38" width="92" height="100" rx="28" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="120" cy="84" r="31" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="106" cy="84" r="5" fill="#1E293B" />
          <circle cx="134" cy="84" r="5" fill="#1E293B" />
          <rect x="117" y="55" width="6" height="9" rx="2" fill="#94A3B8" />
          <rect x="117" y="104" width="6" height="9" rx="2" fill="#94A3B8" />
          <circle cx="120" cy="126" r="5" fill={isActive ? '#0F52BA' : '#94A3B8'} />
          <path d="M104 126H110M130 126H136" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'ac-ir':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="140" rx="50" ry="8" fill="#CBD5E1" fillOpacity="0.6" />
          <rect x="70" y="64" width="100" height="72" rx="18" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <rect x="78" y="72" width="84" height="56" rx="12" fill="#1E293B" />
          <text x="120" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="700" fontFamily="monospace">
            23°C
          </text>
          <path d="M98 42C110 34 130 34 142 42" stroke="#0F52BA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M106 52C114 47 126 47 134 52" stroke="#1D63DC" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="120" cy="118" r="2.5" fill="#38BDF8" />
        </svg>
      );

    case 'switch':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <rect x="66" y="34" width="108" height="112" rx="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <rect x="74" y="42" width="92" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="120" y1="48" x2="120" y2="132" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="97" cy="90" r="10" stroke="#0F52BA" strokeWidth="2" />
          <line x1="97" y1="84" x2="97" y2="90" stroke="#0F52BA" strokeWidth="2" strokeLinecap="round" />
          <circle cx="143" cy="90" r="10" stroke="#94A3B8" strokeWidth="2" />
          <line x1="143" y1="84" x2="143" y2="90" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'doorlock':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <rect x="88" y="24" width="64" height="132" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <rect x="98" y="38" width="44" height="44" rx="6" fill="#1E293B" />
          <circle cx="110" cy="49" r="2" fill="#94A3B8" />
          <circle cx="120" cy="49" r="2" fill="#94A3B8" />
          <circle cx="130" cy="49" r="2" fill="#94A3B8" />
          <circle cx="110" cy="60" r="2" fill="#94A3B8" />
          <circle cx="120" cy="60" r="2" fill="#94A3B8" />
          <circle cx="130" cy="60" r="2" fill="#94A3B8" />
          <circle cx="110" cy="71" r="2" fill="#94A3B8" />
          <circle cx="120" cy="71" r="2" fill="#0F52BA" />
          <circle cx="130" cy="71" r="2" fill="#94A3B8" />
          <rect x="98" y="102" width="54" height="14" rx="7" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="108" cy="109" r="5" fill="#0F52BA" />
          <rect x="111" y="132" width="18" height="12" rx="3" fill="#334155" />
        </svg>
      );

    case 'bundle':
    default:
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          {/* Miniature 4-in-1 ensemble */}
          <rect x="34" y="42" width="172" height="98" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
          {/* Bulb mini */}
          <circle cx="72" cy="84" r="16" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8" />
          <rect x="66" y="99" width="12" height="8" rx="2" fill="#94A3B8" />
          {/* CCTV mini */}
          <circle cx="118" cy="82" r="17" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.8" />
          <circle cx="118" cy="82" r="9" fill="#0F172A" />
          <circle cx="118" cy="82" r="3" fill="#0F52BA" />
          <rect x="106" y="101" width="24" height="6" rx="2" fill="#CBD5E1" />
          {/* Plug + AC mini */}
          <rect x="148" y="64" width="38" height="28" rx="7" fill="#0F172A" />
          <text x="167" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
            23°
          </text>
          <rect x="154" y="98" width="26" height="22" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="163" cy="109" r="2" fill="#0F172A" />
          <circle cx="171" cy="109" r="2" fill="#0F172A" />
          <text x="120" y="128" textAnchor="middle" fill="#0F52BA" fontSize="10" fontWeight="700">
            4-IN-1 ECOSYSTEM KIT
          </text>
        </svg>
      );
  }
};

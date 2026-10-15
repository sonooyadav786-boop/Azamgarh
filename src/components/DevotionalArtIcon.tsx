import React from 'react';
import { CalendarEvent } from '../types/calendar';

interface DevotionalArtIconProps {
  type: CalendarEvent['imageType'];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DevotionalArtIcon: React.FC<DevotionalArtIconProps> = ({ 
  type, 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-14',
    md: 'w-24 h-20 md:w-28 md:h-22',
    lg: 'w-full h-44',
  }[size];

  switch (type) {
    case 'shradh':
      // Matches screenshot 1 & 2: Serene village/ghat courtyard with tree, traditional house, offerings & crow/birds
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#88c5a4] via-[#e2d5b6] to-[#b89568] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c8e4d3" />
                <stop offset="100%" stopColor="#f3e7ce" />
              </linearGradient>
              <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2e7d32" />
                <stop offset="100%" stopColor="#1b5e20" />
              </linearGradient>
            </defs>
            {/* Sky & Courtyard */}
            <rect width="160" height="110" fill="url(#skyGrad)" />
            {/* Traditional village house in background */}
            <polygon points="10,40 45,22 80,40" fill="#a0522d" />
            <rect x="15" y="40" width="60" height="35" fill="#f5deb3" stroke="#8b4513" strokeWidth="1" />
            <rect x="35" y="52" width="16" height="23" fill="#6d4c41" />
            <rect x="58" y="46" width="12" height="12" fill="#5d4037" />
            {/* Sacred Banyan / Peepal Tree with leafy canopy */}
            <path d="M125,75 Q122,50 120,40 Q118,50 115,75" fill="#5d4037" stroke="#4e342e" strokeWidth="6" />
            <circle cx="120" cy="32" r="28" fill="url(#treeGrad)" opacity="0.95" />
            <circle cx="105" cy="38" r="18" fill="#388e3c" />
            <circle cx="135" cy="36" r="18" fill="#1b5e20" />
            {/* Courtyard ground */}
            <rect x="0" y="72" width="160" height="38" fill="#e8d8b8" stroke="#d7ccc8" strokeWidth="1" />
            {/* Stone boundary / fence */}
            <line x1="85" y1="65" x2="160" y2="65" stroke="#795548" strokeWidth="2" strokeDasharray="3,3" />
            {/* Sacred banana leaf with pinda / rice tarpan offering */}
            <ellipse cx="65" cy="88" rx="14" ry="6" fill="#4caf50" stroke="#2e7d32" strokeWidth="1" />
            <circle cx="63" cy="87" r="3" fill="#ffffff" />
            <circle cx="68" cy="87" r="2.5" fill="#f5f5f5" />
            {/* Holy crows (Kakbali) feeding */}
            <path d="M42,88 Q46,84 50,87 L48,89 Q44,89 42,88 Z" fill="#212121" />
            <circle cx="49" cy="86" r="2" fill="#212121" />
            <path d="M52,86 L55,87 L52,88 Z" fill="#ffb300" />
            <path d="M78,85 Q82,81 86,84 L84,86 Q80,86 78,85 Z" fill="#212121" />
            <circle cx="85" cy="83" r="2" fill="#212121" />
            {/* Woman / devotee offering prayer */}
            <circle cx="142" cy="55" r="4" fill="#ffcc80" />
            <path d="M137,60 Q142,58 147,60 L145,78 L139,78 Z" fill="#1e88e5" />
            <path d="M140,60 Q145,58 148,64" stroke="#ffeb3b" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      );

    case 'jain':
      // Matches screenshot 1: Meditating Lord Mahavira / Tirthankara in lotus posture under sacred tree
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#87bc8f] via-[#f7ecd0] to-[#c7a76c] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full object-cover">
            <rect width="160" height="110" fill="#e8f3e5" />
            {/* Sacred tree */}
            <circle cx="80" cy="28" r="36" fill="#3b7a57" opacity="0.85" />
            <circle cx="60" cy="35" r="24" fill="#4d8c67" opacity="0.9" />
            <circle cx="100" cy="35" r="24" fill="#2e6344" opacity="0.9" />
            {/* Golden radiant aura */}
            <circle cx="80" cy="52" r="20" fill="#fff59d" opacity="0.8" />
            <circle cx="80" cy="52" r="14" fill="#ffeb3b" opacity="0.9" />
            {/* Meditating Tirthankara */}
            <circle cx="80" cy="48" r="6" fill="#ffe0b2" stroke="#d7ccc8" strokeWidth="0.5" />
            <ellipse cx="80" cy="62" rx="10" ry="9" fill="#ffcc80" />
            {/* Crossed legs / Padmasana */}
            <ellipse cx="80" cy="74" rx="18" ry="6" fill="#ffb74d" stroke="#f57c00" strokeWidth="0.5" />
            {/* Lotus pedestal */}
            <polygon points="58,82 102,82 98,90 62,90" fill="#bcaaa4" stroke="#795548" strokeWidth="1" />
            <rect x="52" y="90" width="56" height="8" fill="#8d6e63" />
          </svg>
        </div>
      );

    case 'gandhi':
      // Matches screenshot 1: Mahatma Gandhi walking with staff
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-r from-[#d7ccc8] via-[#eefeec] to-[#bcaaa4] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <rect width="160" height="110" fill="#f0eae1" />
            <line x1="0" y1="95" x2="160" y2="95" stroke="#b0bec5" strokeWidth="1" />
            {/* Gandhi Ji figure */}
            <g transform="translate(45, 10)">
              {/* Walking stick */}
              <line x1="28" y1="18" x2="22" y2="82" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
              {/* Head */}
              <circle cx="38" cy="22" r="6" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="1" />
              {/* Glasses */}
              <circle cx="36" cy="22" r="2" fill="none" stroke="#37474f" strokeWidth="0.8" />
              <circle cx="40" cy="22" r="2" fill="none" stroke="#37474f" strokeWidth="0.8" />
              {/* White Shawl / Dhoti */}
              <path d="M32,28 Q38,26 44,28 L46,65 L30,65 Z" fill="#ffffff" stroke="#cfd8dc" strokeWidth="1" />
              {/* Bare feet walking */}
              <line x1="34" y1="65" x2="33" y2="82" stroke="#8d6e63" strokeWidth="2" />
              <line x1="42" y1="65" x2="45" y2="80" stroke="#8d6e63" strokeWidth="2" />
              <rect x="30" y="81" width="6" height="2" fill="#5d4037" />
              <rect x="43" y="79" width="6" height="2" fill="#5d4037" />
            </g>
          </svg>
        </div>
      );

    case 'lakshmi':
      // Matches screenshot 1: Goddess Lakshmi seated on pink lotus with gold
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#ffe082] via-[#ffb74d] to-[#4fc3f7] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <defs>
              <radialGradient id="goldAura" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#fff9c4" />
                <stop offset="100%" stopColor="#f57f17" stopOpacity="0.4" />
              </radialGradient>
            </defs>
            <rect width="160" height="75" fill="url(#goldAura)" />
            <rect x="0" y="75" width="160" height="35" fill="#4fc3f7" opacity="0.6" />
            {/* Divine Aura */}
            <circle cx="80" cy="38" r="26" fill="#fff59d" stroke="#fbc02d" strokeWidth="1.5" />
            {/* Crown (Mukut) */}
            <polygon points="76,22 80,14 84,22" fill="#ffd700" stroke="#e65100" strokeWidth="0.8" />
            {/* Devi face */}
            <circle cx="80" cy="28" r="7" fill="#ffe0b2" />
            {/* Red Saree */}
            <path d="M70,36 Q80,33 90,36 L94,62 L66,62 Z" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />
            <path d="M70,36 Q80,48 90,36" stroke="#ffd700" strokeWidth="2" fill="none" />
            {/* Pink Lotus Petals */}
            <ellipse cx="80" cy="72" rx="34" ry="12" fill="#f48fb1" stroke="#e91e63" strokeWidth="1.2" />
            <polygon points="65,72 80,60 95,72" fill="#f06292" />
            {/* Golden Coins falling */}
            <circle cx="68" cy="52" r="2.5" fill="#ffd700" stroke="#ff8f00" strokeWidth="0.5" />
            <circle cx="66" cy="60" r="2.5" fill="#ffd700" stroke="#ff8f00" strokeWidth="0.5" />
            <circle cx="92" cy="52" r="2.5" fill="#ffd700" stroke="#ff8f00" strokeWidth="0.5" />
          </svg>
        </div>
      );

    case 'shiva':
      // Matches screenshot 2 & 3: Lord Shiva and Parvati / Mahadev with Crescent Moon & Trishul
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#90caf9] via-[#e1bee7] to-[#ffe082] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full object-cover">
            {/* Himalayan Peaks */}
            <polygon points="10,65 45,25 80,65" fill="#90caf9" opacity="0.6" />
            <polygon points="70,65 110,20 150,65" fill="#b0bec5" opacity="0.7" />
            <polygon points="95,20 110,20 120,35 102,35" fill="#ffffff" />
            {/* Radiant Halo */}
            <circle cx="75" cy="42" r="24" fill="#fff9c4" opacity="0.8" />
            {/* Lord Shiva with Jata & Ganga */}
            <circle cx="70" cy="38" r="8" fill="#bbdefb" stroke="#1976d2" strokeWidth="0.8" />
            <path d="M66,32 Q70,22 74,32" fill="#5d4037" />
            {/* Ganga flow */}
            <path d="M72,25 Q82,18 78,35" stroke="#00e5ff" strokeWidth="1.8" fill="none" />
            {/* Crescent Moon */}
            <path d="M65,28 Q67,26 65,24 Q69,26 67,29 Z" fill="#ffffff" />
            {/* Trishul & Damru */}
            <line x1="94" y1="18" x2="94" y2="82" stroke="#d4af37" strokeWidth="2" />
            <path d="M89,24 Q94,28 99,24 L94,15 Z" fill="#d4af37" />
            <polygon points="90,36 98,42 90,48" fill="#8d6e63" />
            {/* Meditation body in tiger skin */}
            <path d="M60,46 Q70,44 80,46 L84,72 L56,72 Z" fill="#bbdefb" />
            <rect x="52" y="70" width="36" height="8" fill="#ffb300" stroke="#e65100" strokeWidth="0.8" />
          </svg>
        </div>
      );

    case 'kalki':
      // Matches screenshot 2: Kalki Avatar on magnificent white divine horse
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#80deea] via-[#c8e6c9] to-[#81c784] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <rect width="160" height="70" fill="#b2ebf2" />
            <rect x="0" y="70" width="160" height="40" fill="#a5d6a7" />
            {/* Divine white horse gallop */}
            <path d="M65,48 Q78,42 90,46 Q100,50 110,44 L114,35 Q108,30 102,32 L98,40 Q84,38 72,44 Z" fill="#ffffff" stroke="#b0bec5" strokeWidth="1" />
            {/* Horse legs */}
            <line x1="72" y1="46" x2="62" y2="76" stroke="#ffffff" strokeWidth="3" />
            <line x1="95" y1="48" x2="105" y2="74" stroke="#ffffff" strokeWidth="3" />
            <line x1="90" y1="48" x2="88" y2="76" stroke="#ffffff" strokeWidth="2.5" />
            {/* Glowing Sword of Kalki */}
            <line x1="86" y1="34" x2="108" y2="16" stroke="#ffd700" strokeWidth="2.5" />
            <circle cx="108" cy="16" r="3" fill="#ffffff" />
            {/* Heroic warrior seated */}
            <circle cx="82" cy="30" r="5" fill="#ffe0b2" />
            <polygon points="76,34 88,34 84,48 80,48" fill="#ff9800" />
          </svg>
        </div>
      );

    case 'pitru_hamsa':
      // Matches screenshot 2: Sacred swan (Hamsa) on dark reflective holy water
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#1a237e] via-[#0d1b2a] to-[#000000] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <rect width="160" height="110" fill="#0b0f19" />
            {/* Water reflections */}
            <ellipse cx="80" cy="85" rx="55" ry="12" fill="#1e293b" opacity="0.6" />
            <ellipse cx="80" cy="90" rx="35" ry="6" fill="#334155" opacity="0.4" />
            {/* Swan Body */}
            <ellipse cx="80" cy="65" rx="28" ry="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            {/* Graceful Neck */}
            <path d="M96,62 Q108,54 104,40 Q100,32 94,36 Q92,42 94,50" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            {/* Head & Beak */}
            <circle cx="94" cy="36" r="4.5" fill="#ffffff" />
            <polygon points="90,36 82,38 90,40" fill="#ff9800" />
            <circle cx="92" cy="35" r="1" fill="#000000" />
          </svg>
        </div>
      );

    case 'amavasya':
      // Matches screenshot 2: Dark celestial moon in clouds
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#263238] via-[#37474f] to-[#455a64] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <rect width="160" height="110" fill="#1c2529" />
            {/* Dark Moon Sphere with faint silver rim */}
            <circle cx="80" cy="50" r="28" fill="#2d3748" stroke="#718096" strokeWidth="1.2" opacity="0.9" />
            <circle cx="74" cy="44" r="26" fill="#1a202c" opacity="0.95" />
            {/* Soft silver clouds */}
            <path d="M20,80 Q50,60 80,75 Q110,60 140,80 L140,110 L20,110 Z" fill="#cfd8dc" opacity="0.35" />
            <path d="M40,88 Q80,72 120,88 L120,110 L40,110 Z" fill="#eceff1" opacity="0.5" />
          </svg>
        </div>
      );

    case 'naivedya':
      // Matches screenshot 2: Holy fruit and sweet offering thali with sacred melon, pineapple, apples
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#e0f7fa] via-[#fff9c4] to-[#ffecb3] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            {/* Silver / Brass Puja Thali */}
            <ellipse cx="80" cy="78" rx="45" ry="14" fill="#ffd54f" stroke="#ffb300" strokeWidth="2" />
            {/* Watermelon slice */}
            <path d="M45,74 A22,22 0 0,0 72,74 Z" fill="#e53935" stroke="#2e7d32" strokeWidth="3" />
            {/* Red Apples */}
            <circle cx="78" cy="68" r="8" fill="#d32f2f" />
            <circle cx="92" cy="70" r="7" fill="#f44336" />
            {/* Pineapple with green crown */}
            <ellipse cx="106" cy="62" rx="10" ry="16" fill="#fbc02d" stroke="#f57f17" strokeWidth="1" />
            <path d="M106,46 L102,32 L106,36 L110,32 Z" fill="#388e3c" />
          </svg>
        </div>
      );

    case 'agrasen':
    case 'durga':
      // Matches screenshot 2: Maharaja Agrasen / Maa Durga on Royal Throne with sacred umbrella
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#fff8e1] via-[#ffe082] to-[#ffca28] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            {/* Royal Chatra (Umbrella) */}
            <path d="M60,25 Q80,12 100,25 Z" fill="#d32f2f" stroke="#ffd700" strokeWidth="1.5" />
            <line x1="80" y1="20" x2="80" y2="40" stroke="#ffd700" strokeWidth="2" />
            {/* Royal Throne backrest */}
            <rect x="52" y="38" width="56" height="42" rx="6" fill="#e65100" stroke="#ffd700" strokeWidth="1.5" />
            {/* Crown & King face */}
            <polygon points="76,32 80,24 84,32" fill="#ffd700" stroke="#b71c1c" strokeWidth="0.8" />
            <circle cx="80" cy="38" r="6" fill="#ffcc80" />
            {/* Royal Silk robes */}
            <path d="M68,44 Q80,42 92,44 L96,75 L64,75 Z" fill="#c2185b" stroke="#ffd700" strokeWidth="1" />
            {/* Golden Pedestal */}
            <rect x="44" y="78" width="72" height="12" fill="#ffb300" stroke="#e65100" strokeWidth="1" />
          </svg>
        </div>
      );

    case 'diwali':
    case 'diya':
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#311b92] via-[#b71c1c] to-[#ff6f00] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            {/* Terracotta Diya base */}
            <ellipse cx="80" cy="74" rx="34" ry="14" fill="#d84315" stroke="#bf360c" strokeWidth="2" />
            <ellipse cx="80" cy="71" rx="28" ry="8" fill="#e64a19" />
            {/* Sacred Glowing Flame */}
            <path d="M80,68 C72,56 70,44 80,26 C90,44 88,56 80,68 Z" fill="#ffd600" />
            <path d="M80,65 C76,56 75,48 80,36 C85,48 84,56 80,65 Z" fill="#ffffff" />
            {/* Aura sparkles */}
            <circle cx="60" cy="38" r="2" fill="#fff9c4" />
            <circle cx="100" cy="38" r="2" fill="#fff9c4" />
            <circle cx="80" cy="18" r="2.5" fill="#fff9c4" />
          </svg>
        </div>
      );

    case 'hanuman':
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#ff6f00] via-[#ff8f00] to-[#e65100] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <circle cx="80" cy="40" r="28" fill="#ffe082" opacity="0.8" />
            {/* Hanuman Ji figure with golden aura */}
            <circle cx="80" cy="34" r="9" fill="#ffb74d" stroke="#e65100" strokeWidth="0.8" />
            {/* Crown */}
            <polygon points="76,25 80,16 84,25" fill="#ffd700" stroke="#b71c1c" strokeWidth="0.8" />
            {/* Gada (Mace) */}
            <line x1="104" y1="20" x2="94" y2="70" stroke="#ffd700" strokeWidth="3" />
            <circle cx="104" cy="20" r="8" fill="#ffd700" stroke="#ff8f00" strokeWidth="1" />
            {/* Saffron body & angavastra */}
            <path d="M70,42 Q80,40 90,42 L88,72 L72,72 Z" fill="#ff3d00" />
            {/* Sanjeevani Mountain in hand */}
            <polygon points="56,40 68,22 80,40" fill="#2e7d32" stroke="#1b5e20" strokeWidth="1" />
            <circle cx="68" cy="22" r="2" fill="#fff9c4" />
          </svg>
        </div>
      );

    case 'ganesh':
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#ffe082] via-[#ffb74d] to-[#d84315] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <circle cx="80" cy="40" r="26" fill="#fff9c4" opacity="0.85" />
            {/* Crown */}
            <polygon points="75,22 80,12 85,22" fill="#ffd700" stroke="#d84315" strokeWidth="1" />
            {/* Elephant face & trunk */}
            <circle cx="80" cy="34" r="10" fill="#ffcc80" />
            {/* Trunk curves to left with Modak */}
            <path d="M80,38 Q82,52 72,50 Q66,48 68,44" fill="none" stroke="#ffb74d" strokeWidth="4" strokeLinecap="round" />
            <circle cx="68" cy="44" r="3" fill="#ffd700" stroke="#e65100" strokeWidth="0.5" />
            {/* Big ears (Soop Karna) */}
            <ellipse cx="68" cy="34" rx="6" ry="9" fill="#ffcc80" />
            <ellipse cx="92" cy="34" rx="6" ry="9" fill="#ffcc80" />
            {/* Yellow pitambar robes */}
            <path d="M68,46 Q80,44 92,46 L90,75 L70,75 Z" fill="#ffd600" stroke="#ff6f00" strokeWidth="1" />
          </svg>
        </div>
      );

    case 'ram':
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#80deea] via-[#ffe082] to-[#ffb300] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <circle cx="80" cy="38" r="26" fill="#fff9c4" opacity="0.8" />
            {/* Divine face of Lord Rama */}
            <circle cx="80" cy="32" r="8" fill="#b0bec5" stroke="#37474f" strokeWidth="0.8" />
            {/* Royal Crown */}
            <polygon points="76,24 80,14 84,24" fill="#ffd700" stroke="#b71c1c" strokeWidth="0.8" />
            {/* Bow (Kodanda Dhanush) */}
            <path d="M60,18 Q52,48 60,78" fill="none" stroke="#ffd700" strokeWidth="2.5" />
            <line x1="60" y1="18" x2="60" y2="78" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2,2" />
            {/* Arrow (Baan) in hand */}
            <line x1="72" y1="36" x2="102" y2="18" stroke="#d84315" strokeWidth="1.8" />
            <polygon points="102,18 97,19 99,23" fill="#d84315" />
            {/* Pitambar dress */}
            <path d="M72,40 Q80,38 88,40 L90,72 L70,72 Z" fill="#ffd600" />
          </svg>
        </div>
      );

    case 'krishna':
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#64b5f6] via-[#ffe082] to-[#ffb74d] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            <circle cx="80" cy="38" r="26" fill="#fff9c4" opacity="0.8" />
            {/* Peacock Feather (Mor Mukut) */}
            <ellipse cx="80" cy="16" rx="6" ry="10" fill="#00897b" />
            <ellipse cx="80" cy="16" rx="3.5" ry="6" fill="#1e88e5" />
            <circle cx="80" cy="16" r="1.5" fill="#ffd700" />
            {/* Shyama face */}
            <circle cx="80" cy="32" r="8" fill="#90caf9" stroke="#1565c0" strokeWidth="0.8" />
            {/* Flute (Bansuri) across lips */}
            <line x1="60" y1="38" x2="100" y2="34" stroke="#ffd700" strokeWidth="2.5" />
            <circle cx="68" cy="37" r="1" fill="#5d4037" />
            <circle cx="75" cy="36" r="1" fill="#5d4037" />
            <circle cx="82" cy="35" r="1" fill="#5d4037" />
            {/* Yellow Pitambar */}
            <path d="M72,40 Q80,38 88,40 L90,72 L70,72 Z" fill="#ffd600" />
          </svg>
        </div>
      );

    case 'chhat':
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#ff7043] via-[#ffb74d] to-[#42a5f5] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            {/* Rising Sun with radiant rays */}
            <circle cx="80" cy="48" r="24" fill="#ff3d00" opacity="0.9" />
            <circle cx="80" cy="48" r="18" fill="#ffea00" />
            {/* Holy river waters */}
            <rect x="0" y="65" width="160" height="45" fill="#1e88e5" opacity="0.8" />
            <path d="M0,68 Q40,62 80,68 Q120,74 160,68 L160,110 L0,110 Z" fill="#1565c0" />
            {/* Devotee offering Arghya with Soop / Daura */}
            <polygon points="68,64 92,64 88,72 72,72" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="1" />
            <circle cx="80" cy="56" r="4" fill="#ffcc80" />
          </svg>
        </div>
      );

    default:
      // Sacred Kalash with Coconut and Mango Leaves
      return (
        <div className={`relative overflow-hidden rounded-md border border-amber-800/20 bg-gradient-to-b from-[#ffecb3] via-[#ffe082] to-[#ffb74d] flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 160 110" className="w-full h-full">
            {/* Sacred Kalash pot */}
            <path d="M64,54 Q80,50 96,54 L92,80 Q80,86 68,80 Z" fill="#d84315" stroke="#bf360c" strokeWidth="1.5" />
            {/* Coconut on top */}
            <ellipse cx="80" cy="38" rx="10" ry="12" fill="#5d4037" />
            {/* Mango Leaves */}
            <path d="M70,44 Q60,34 64,28 Q72,36 74,42" fill="#2e7d32" />
            <path d="M90,44 Q100,34 96,28 Q88,36 86,42" fill="#2e7d32" />
            {/* Swastika on pot */}
            <text x="80" y="72" textAnchor="middle" fontSize="16" fill="#ffd700" fontWeight="bold">卐</text>
          </svg>
        </div>
      );
  }
};

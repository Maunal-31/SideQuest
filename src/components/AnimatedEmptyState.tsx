import React, { useMemo } from 'react';

interface AnimatedEmptyStateProps {
  title: string;
  subtitle: string;
}

const AnimatedEmptyState: React.FC<AnimatedEmptyStateProps> = ({ title, subtitle }) => {
  // Memoize keys so they don't re-render and lose animation state
  const keyboardKeys = useMemo(() => {
    const keys: React.ReactNode[] = [];
    const keyWidth = 28;
    const keyHeight = 20;
    const gap = 4;
    const startX = 155;
    const startY = 295;
    
    let keyId = 0;
    const addKey = (x: number, y: number, w: number, h: number) => {
      keys.push(
        <rect 
          key={keyId} 
          x={x} 
          y={y} 
          width={w} 
          height={h} 
          rx="3" 
          className={`kbd-key key-${keyId % 15}`} 
        />
      );
      keyId++;
    };

    for(let r=0; r<4; r++) {
      for(let i=0; i<15; i++) {
        addKey(startX + i*(keyWidth+gap), startY + r*(keyHeight+gap), keyWidth, keyHeight);
      }
    }
    // Row 5 (Spacebar row)
    for(let i=0; i<4; i++) addKey(startX + i*(keyWidth+gap), startY + 4*(keyHeight+gap), keyWidth, keyHeight);
    addKey(startX + 4*(keyWidth+gap), startY + 4*(keyHeight+gap), keyWidth*6 + gap*5, keyHeight); // Spacebar
    for(let i=10; i<15; i++) addKey(startX + i*(keyWidth+gap), startY + 4*(keyHeight+gap), keyWidth, keyHeight);
    
    return keys;
  }, []);

  return (
    <div className="col-span-full text-center py-12 text-black bg-white rounded-2xl brutal-border brutal-shadow p-6 flex flex-col items-center justify-center w-full h-full">
      <style>
        {`
          .kbd-key {
            fill: #FFFFFF;
            transform-origin: center;
          }
          @keyframes press {
            0%, 90%, 100% { fill: #FFFFFF; transform: translateY(0); }
            95% { fill: #D8C5A5; transform: translateY(2px); }
          }
          .key-0 { animation: press 3s infinite 0.1s; }
          .key-1 { animation: press 2.5s infinite 0.4s; }
          .key-2 { animation: press 3.2s infinite 0.7s; }
          .key-3 { animation: press 2.8s infinite 1.2s; }
          .key-4 { animation: press 3.5s infinite 1.5s; }
          .key-5 { animation: press 2.2s infinite 1.8s; }
          .key-6 { animation: press 3.1s infinite 0.3s; }
          .key-7 { animation: press 2.7s infinite 0.9s; }
          .key-8 { animation: press 3.4s infinite 1.1s; }
          .key-9 { animation: press 2.9s infinite 0.6s; }
          .key-10 { animation: press 3.3s infinite 1.4s; }
          .key-11 { animation: press 2.6s infinite 0.2s; }
          .key-12 { animation: press 3.0s infinite 1.7s; }
          .key-13 { animation: press 2.4s infinite 0.8s; }
          .key-14 { animation: press 3.6s infinite 1.3s; }

          @keyframes typeLeft {
            0% { transform: translate(0px, 0px); }
            10% { transform: translate(-8px, -4px); }
            20% { transform: translate(-4px, 6px); }
            30% { transform: translate(6px, -2px); }
            40% { transform: translate(2px, 8px); }
            50% { transform: translate(-4px, -2px); }
            60% { transform: translate(-10px, 4px); }
            70% { transform: translate(4px, 6px); }
            80% { transform: translate(8px, -4px); }
            90% { transform: translate(-2px, -6px); }
            100% { transform: translate(0px, 0px); }
          }
          @keyframes typeRight {
            0% { transform: translate(0px, 0px); }
            15% { transform: translate(6px, -6px); }
            25% { transform: translate(-4px, -3px); }
            35% { transform: translate(-8px, 4px); }
            45% { transform: translate(6px, 6px); }
            55% { transform: translate(4px, -4px); }
            65% { transform: translate(-6px, 2px); }
            75% { transform: translate(-4px, 6px); }
            85% { transform: translate(8px, -2px); }
            95% { transform: translate(4px, -4px); }
            100% { transform: translate(0px, 0px); }
          }
          .animate-type-left {
            animation: typeLeft 3s infinite ease-in-out;
            will-change: transform;
          }
          .animate-type-right {
            animation: typeRight 3.5s infinite ease-in-out;
            will-change: transform;
          }
          @keyframes tap {
            0%, 80%, 100% { transform: translateY(0); }
            90% { transform: translateY(6px); }
          }
          .finger-0 { animation: tap 1.5s infinite 0.1s; }
          .finger-1 { animation: tap 1.2s infinite 0.4s; }
          .finger-2 { animation: tap 1.8s infinite 0.2s; }
          .finger-3 { animation: tap 1.4s infinite 0.7s; }
          .finger-4 { animation: tap 1.6s infinite 0.5s; }
        `}
      </style>

      <div className="w-full max-w-[280px] mx-auto mb-4 relative rounded-2xl overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 800 600" className="w-full h-auto block mx-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Background removed to blend into card */}

          {/* Static Shadows */}
          <g fill="rgba(0,0,0,0.12)">
            {/* Monitor Shadow */}
            <polygon points="100,200 700,200 1100,600 500,600" />
            {/* Keyboard Shadow */}
            <polygon points="145,420 645,420 645,280 965,600 465,600" />
            {/* Mouse Shadow */}
            <polygon points="700,410 760,320 1040,600 980,600" />
          </g>

          {/* Mouse Cord */}
          <path d="M 740 320 C 740 240, 400 240, 400 280" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

          {/* Mouse */}
          <path d="M 720 320 L 740 320 C 750 320, 760 330, 760 350 L 760 380 C 760 400, 750 410, 740 410 L 720 410 C 710 410, 700 400, 700 380 L 700 350 C 700 330, 710 320, 720 320 Z" fill="#FDF7EA" />
          <path d="M 740 320 C 750 320, 760 330, 760 350 L 760 380 C 760 400, 750 410, 740 410 Z" fill="#E8DCC2" />

          {/* Monitor Stand */}
          <path d="M 370 200 L 380 230 L 420 230 L 430 200 Z" fill="#FFF9E6" />
          <rect x="360" y="230" width="80" height="10" rx="3" fill="#E8DCC2" />

          {/* Monitor */}
          <rect x="100" y="150" width="600" height="40" rx="20" fill="#E8DCC2" /> 
          <rect x="100" y="80" width="600" height="100" rx="20" fill="#F3E8D3" />
          <rect x="120" y="100" width="560" height="60" rx="10" fill="#014175" />
          
          {/* Keyboard Base */}
          <rect x="145" y="280" width="500" height="140" rx="10" fill="#E8DCC2" /> 
          <rect x="145" y="280" width="500" height="135" rx="10" fill="#F5E8D3" />

          {/* Keyboard Keys */}
          {keyboardKeys}

          {/* Left Hand Group */}
          <g className="animate-type-left">
            <polygon points="260,350 350,320 630,600 340,600" fill="rgba(0,0,0,0.12)" />
            <rect x="230" y="480" width="100" height="130" fill="#FFF9E6" />
            <circle cx="270" cy="530" r="6" fill="#E95326" />
            <path d="M 240 480 L 240 370 L 256 370 C 256 390, 260 390, 260 370 L 276 370 C 276 390, 280 390, 280 370 L 296 370 C 296 390, 300 390, 300 370 L 316 370 C 316 390, 321 395, 321 405 L 321 420 L 342 435 L 320 480 Z" fill="#EDA27E" />
            
            {/* Fingers */}
            <g className="finger-1">
              <rect x="240" y="340" width="16" height="60" rx="8" fill="#EDA27E" />
              <circle cx="248" cy="347" r="3.5" fill="#FDF1E7" />
            </g>
            <g className="finger-2">
              <rect x="260" y="325" width="16" height="75" rx="8" fill="#EDA27E" />
              <circle cx="268" cy="332" r="3.5" fill="#FDF1E7" />
            </g>
            <g className="finger-3">
              <rect x="280" y="315" width="16" height="85" rx="8" fill="#EDA27E" />
              <circle cx="288" cy="322" r="3.5" fill="#FDF1E7" />
            </g>
            <g className="finger-4">
              <rect x="300" y="325" width="16" height="75" rx="8" fill="#EDA27E" />
              <circle cx="308" cy="332" r="3.5" fill="#FDF1E7" />
            </g>
            
            {/* Thumb */}
            <g className="finger-0">
              <rect x="321" y="390" width="22" height="55" rx="11" fill="#EDA27E" />
              <circle cx="331" cy="399" r="3.5" fill="#FDF1E7" />
            </g>
          </g>

          {/* Right Hand Group */}
          <g className="animate-type-right">
            <polygon points="479,325 570,350 820,600 530,600" fill="rgba(0,0,0,0.12)" />
            <rect x="470" y="480" width="100" height="130" fill="#FFF9E6" />
            <circle cx="530" cy="530" r="6" fill="#E95326" />
            <path d="M 560 480 L 560 370 L 544 370 C 544 390, 540 390, 540 370 L 524 370 C 524 390, 520 390, 520 370 L 504 370 C 504 390, 500 390, 500 370 L 484 370 C 484 390, 479 395, 479 405 L 479 420 L 458 435 L 480 480 Z" fill="#EDA27E" />
            
            {/* Fingers */}
            <g className="finger-1">
              <rect x="484" y="325" width="16" height="75" rx="8" fill="#EDA27E" />
              <circle cx="492" cy="332" r="3.5" fill="#FDF1E7" />
            </g>
            <g className="finger-2">
              <rect x="504" y="315" width="16" height="85" rx="8" fill="#EDA27E" />
              <circle cx="512" cy="322" r="3.5" fill="#FDF1E7" />
            </g>
            <g className="finger-3">
              <rect x="524" y="325" width="16" height="75" rx="8" fill="#EDA27E" />
              <circle cx="532" cy="332" r="3.5" fill="#FDF1E7" />
            </g>
            <g className="finger-4">
              <rect x="544" y="340" width="16" height="60" rx="8" fill="#EDA27E" />
              <circle cx="552" cy="347" r="3.5" fill="#FDF1E7" />
            </g>
            
            {/* Thumb */}
            <g className="finger-0">
              <rect x="457" y="390" width="22" height="55" rx="11" fill="#EDA27E" />
              <circle cx="467" cy="399" r="3.5" fill="#FDF1E7" />
            </g>
          </g>
        </svg>
      </div>

      <h3 className="text-2xl font-black uppercase mb-1 mt-2 text-black">{title}</h3>
      <p className="font-bold text-gray-500 max-w-sm">{subtitle}</p>
    </div>
  );
};

export default AnimatedEmptyState;

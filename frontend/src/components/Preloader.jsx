import React from "react";

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0b0f]">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <svg width="260" height="96" viewBox="0 0 260 96" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ommStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b3b3ff" />
                <stop offset="55%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#8ec5ff" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="omm-glow-text"
            >
              OMM
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="omm-stroke-text"
            >
              OMM
            </text>
          </svg>
          <span className="absolute -bottom-2 left-1/2 h-[2px] w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/15">
            <span className="omm-line-sweep block h-full w-14 rounded-full bg-white/90" />
          </span>
        </div>
        <p className="text-[11px] tracking-[0.34em] text-white/65">PREPARING OMMVERSE</p>
      </div>

      <style>{`
        .omm-glow-text {
          font-family: "Poppins", sans-serif;
          font-size: 68px;
          font-weight: 700;
          letter-spacing: 0.08em;
          fill: rgba(255, 255, 255, 0.07);
          animation: ommGlow 1.8s ease-in-out infinite alternate;
        }

        .omm-stroke-text {
          font-family: "Poppins", sans-serif;
          font-size: 68px;
          font-weight: 700;
          letter-spacing: 0.08em;
          fill: transparent;
          stroke: url(#ommStroke);
          stroke-width: 1.4;
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: ommTrace 2s ease-in-out infinite;
        }

        .omm-line-sweep {
          animation: ommSweep 1.35s ease-in-out infinite;
        }

        @keyframes ommTrace {
          0% { stroke-dashoffset: 320; opacity: 0.45; }
          45% { opacity: 1; }
          60% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -320; opacity: 0.45; }
        }

        @keyframes ommGlow {
          0% { fill: rgba(255, 255, 255, 0.04); }
          100% { fill: rgba(255, 255, 255, 0.14); }
        }

        @keyframes ommSweep {
          0% { transform: translateX(-180%); opacity: 0.15; }
          50% { opacity: 0.95; }
          100% { transform: translateX(350%); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;


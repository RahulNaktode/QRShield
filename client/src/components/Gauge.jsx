function Gauge({ score, color }) {
  const r = 68;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(score, 100) / 100) * circ;

  return (
    <svg
      viewBox="0 0 176 176"
      className="w-44 h-44"
    >
      <circle
        cx="88"
        cy="88"
        r={r}
        fill="none"
        strokeWidth="12"
        className="stroke-[#1B2331]"
      />

      <circle
        cx="88"
        cy="88"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 88 88)"
        className="transition-[stroke-dashoffset,stroke] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
      />
    </svg>
  );
}

export default Gauge;
type GestifyMarkProps = {
  className?: string;
  showCharts?: boolean;
};

export default function GestifyMark({
  className = "h-8 w-8",
  showCharts = false,
}: GestifyMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 10C12.686 10 10 12.686 10 16V48C10 51.314 12.686 54 16 54H41C44.314 54 47 51.314 47 48V40H39C35.686 40 33 37.314 33 34C33 30.686 35.686 28 39 28H54V16C54 12.686 51.314 10 48 10H16Z"
        fill="#165DFF"
      />
      <path
        d="M10 41.5V48C10 51.314 12.686 54 16 54H41C44.314 54 47 51.314 47 48V40H37C34.791 40 33 38.209 33 36C33 33.791 34.791 32 37 32H40.5L47 25.5V40H54V28H39C35.686 28 33 30.686 33 34C33 37.314 35.686 40 39 40H21.5L10 41.5Z"
        fill="#69B1FF"
      />
      <rect x="19" y="19" width="18" height="18" rx="5.5" fill="white" />
      <g className={showCharts ? "opacity-100" : "opacity-0"}>
        <rect x="22" y="29.5" width="3.2" height="6.5" rx="1.2" fill="#A7D3FF" />
        <rect x="27.4" y="26.5" width="3.2" height="9.5" rx="1.2" fill="#69B1FF" />
        <rect x="32.8" y="23" width="3.2" height="13" rx="1.2" fill="#165DFF" />
      </g>
    </svg>
  );
}

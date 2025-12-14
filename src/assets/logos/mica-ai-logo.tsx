const MicaAi = ({ size }: { size: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 2000 2000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2010_15)">
        <path
          d="M598.04 598.041C835.285 360.795 1219.94 360.795 1457.18 598.041L1201.62 853.603C1105.52 949.706 949.704 949.706 853.601 853.603L598.04 598.041Z"
          fill="currentColor"
        />
        <path
          d="M598.063 1457.2L853.625 1201.63C949.728 1105.53 1105.54 1105.53 1201.64 1201.64L1457.21 1457.2C1219.96 1694.44 835.309 1694.44 598.063 1457.2Z"
          fill="currentColor"
        />
        <circle
          cx="999.628"
          cy="999.628"
          r="906.56"
          transform="rotate(-45 999.628 999.628)"
          stroke="currentColor"
          strokeWidth="130.897"
        />
      </g>
      <defs>
        <clipPath id="clip0_2010_15">
          <rect width="2000" height="2000" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MicaAi;

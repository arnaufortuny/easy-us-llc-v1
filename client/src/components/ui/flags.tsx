import { useId } from "react";

export const SpainFlag = ({ className = "w-6 h-6" }: { className?: string }) => {
  const id = useId();
  return (
    <svg viewBox="0 0 36 36" className={className}>
      <defs>
        <clipPath id={`spain-${id}`}>
          <circle cx="18" cy="18" r="18"/>
        </clipPath>
      </defs>
      <g clipPath={`url(#spain-${id})`}>
        <rect fill="#C60A1D" width="36" height="36"/>
        <rect fill="#FFC400" y="9" width="36" height="18"/>
      </g>
    </svg>
  );
};

export const USAFlag = ({ className = "w-6 h-6" }: { className?: string }) => {
  const id = useId();
  return (
    <svg viewBox="0 0 36 36" className={className}>
      <defs>
        <clipPath id={`usa-${id}`}>
          <circle cx="18" cy="18" r="18"/>
        </clipPath>
      </defs>
      <g clipPath={`url(#usa-${id})`}>
        <rect fill="#B22234" width="36" height="36"/>
        <rect fill="#FFFFFF" y="2.77" width="36" height="2.77"/>
        <rect fill="#FFFFFF" y="8.31" width="36" height="2.77"/>
        <rect fill="#FFFFFF" y="13.85" width="36" height="2.77"/>
        <rect fill="#FFFFFF" y="19.39" width="36" height="2.77"/>
        <rect fill="#FFFFFF" y="24.93" width="36" height="2.77"/>
        <rect fill="#FFFFFF" y="30.47" width="36" height="2.77"/>
        <rect fill="#3C3B6E" width="14.4" height="19.39"/>
      </g>
    </svg>
  );
};

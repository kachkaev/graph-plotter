import * as React from "react";

const Foreground: React.FunctionComponent<React.HTMLAttributes<SVGElement>> = (
  props,
) => {
  return (
    <svg
      {...props}
      viewBox="5 5 355 360" /* height="381.5px" width="380.85px" */
    >
      <g>
        <path
          d="M380.45 10.0 L380.5 33.75 370.75 34.0 Q176.25 39.6 11.0 80.95 L0.0 83.75 0.0 10.0 Q0.0 2.15 6.2 0.45 L9.5 0.0 370.45 0.0 373.15 0.25 Q380.45 1.45 380.45 10.0 M370.5 10.95 L370.5 11.0 370.6 11.0 370.55 10.95 370.5 10.95"
          fill="#000000"
          fillOpacity="0.023529412"
          fillRule="evenodd"
          stroke="none"
        />
        <path
          d="M0.0 359.05 L0.0 305.75 11.0 305.1 Q103.45 299.3 181.3 285.8 290.55 266.85 370.9 230.75 L380.65 225.75 380.7 285.8 380.75 285.8 380.8 336.35 371.0 338.35 Q202.4 371.5 11.0 359.75 L0.0 359.05"
          fill="#000000"
          fillOpacity="0.03137255"
          fillRule="evenodd"
          stroke="none"
        />
        <path
          d="M0.0 359.05 L11.0 359.75 Q202.4 371.5 371.0 338.35 L380.8 336.35 380.85 371.5 Q380.85 381.5 370.85 381.5 L10.0 381.5 Q0.0 381.5 0.0 371.5 L0.0 359.05 M11.0 370.75 L11.0 370.65 10.95 370.7 11.0 370.75"
          fill="#000000"
          fillOpacity="0.043137256"
          fillRule="evenodd"
          stroke="none"
        />
      </g>
    </svg>
  );
};

const WrappedForeground = React.memo(Foreground);
export { WrappedForeground as Foreground };

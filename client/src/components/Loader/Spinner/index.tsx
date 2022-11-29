/** @jsxImportSource @emotion/react */
import { Oval } from "react-loader-spinner";

export interface SpinnerProps {
  color: string;
  trackColor?: string;
  size?: number;
}

const Spinner = ({ color, trackColor, size }: SpinnerProps) => {
  return (
    <Oval
      height={size ?? 80}
      width={size ?? 80}
      color={color}
      ariaLabel="oval-loading"
      secondaryColor={trackColor ?? "rgba(32, 32, 32, 0.2)"}
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
  );
};

export default Spinner;

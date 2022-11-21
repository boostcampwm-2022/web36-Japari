/** @jsxImportSource @emotion/react */
import { logoStyle } from "./styles";

export interface LogoProps {
  logoType: "IMAGE_ONLY" | "WORD_ONLY" | "BOTH";
}

function Logo({ logoType }: LogoProps) {
  if (logoType === "IMAGE_ONLY") {
    return (
      <div css={logoStyle}>
        <img src="/logo/japari-logo-image.svg" />
      </div>
    );
  }

  if (logoType === "WORD_ONLY") {
    return (
      <div css={logoStyle}>
        <img src="/logo/japari-logo-word.svg" />
      </div>
    );
  }

  return (
    <div css={logoStyle}>
      <img src="/logo/japari-logo-image.svg" />
      <img src="/logo/japari-logo-word.svg" />
    </div>
  );
}

export default Logo;

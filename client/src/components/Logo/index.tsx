/** @jsxImportSource @emotion/react */
import { logoStyle } from "./styles";
import logoImage from "../../../public/logo/japari-logo-image.png";
import logoWord from "../../../public/logo/japari-logo-word.png";

export interface LogoProps {
  logoType: "IMAGE_ONLY" | "WORD_ONLY" | "BOTH";
}

function Logo({ logoType }: LogoProps) {
  if (logoType === "IMAGE_ONLY") {
    return (
      <div css={logoStyle}>
        <img src={logoImage} />
      </div>
    );
  }

  if (logoType === "WORD_ONLY") {
    return (
      <div css={logoStyle}>
        <img src={logoWord} />
      </div>
    );
  }

  return (
    <div css={logoStyle}>
      <img src={logoImage} />
      <img src={logoWord} />
    </div>
  );
}

export default Logo;

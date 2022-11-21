/** @jsxImportSource @emotion/react */
import { logoStyle } from "./styles";
import JapariLogoGame from "../../assets/logo/japari-logo-image.svg";
import JapariLogoWord from "../../assets/logo/japari-logo-word.svg";

export interface LogoProps {
  logoType: "IMAGE_ONLY" | "WORD_ONLY" | "BOTH";
}

function Logo({ logoType }: LogoProps) {
  if (logoType === "IMAGE_ONLY") {
    return (
      <div css={logoStyle}>
        <img src={JapariLogoGame} />
      </div>
    );
  }

  if (logoType === "WORD_ONLY") {
    return (
      <div css={logoStyle}>
        <img src={JapariLogoWord} />
      </div>
    );
  }

  return (
    <div css={logoStyle}>
      <img src={JapariLogoGame} />
      <img src={JapariLogoWord} />
    </div>
  );
}

export default Logo;

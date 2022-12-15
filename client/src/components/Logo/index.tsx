/** @jsxImportSource @emotion/react */
import { logoIconStyle, logoStyle, logoWordStyle } from "./styles";
import JapariLogoGame from "../../assets/logo/japari-logo-image.svg";
import JapariLogoWord from "../../assets/logo/japari-logo-word.svg";

export interface LogoProps {
  logoType: "IMAGE_ONLY" | "WORD_ONLY" | "BOTH";
}

const Logo = ({ logoType }: LogoProps) => {
  if (logoType === "IMAGE_ONLY") {
    return (
      <div css={logoStyle}>
        <img src={JapariLogoGame} alt="JapariLogoGame" />
      </div>
    );
  }

  if (logoType === "WORD_ONLY") {
    return (
      <div css={logoStyle}>
        <img src={JapariLogoWord} alt="JapariLogoWord" />
      </div>
    );
  }

  return (
    <div css={logoStyle}>
      <img css={logoIconStyle} src={JapariLogoGame} alt="JapariLogoGame" />
      <img css={logoWordStyle} src={JapariLogoWord} alt="JapariLogoWord" />
    </div>
  );
};

export default Logo;

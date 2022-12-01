/** @jsxImportSource @emotion/react */
import React, { useEffect } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import LandingImage from "../../assets/images/landing-image.png";
import JaPartyWord from "../../assets/logo/Ja-Party-word.png";
import NaverLogo from "../../assets/logo/naver_logo.png";
import KakaoLogo from "../../assets/logo/kakao_logo.png";
import GoogleLogo from "../../assets/logo/google_logo.png";
import GithubLogo from "../../assets/logo/github_logo.png";
import { isLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const handleGithubLogin = () => {
    window.location.href = process.env.REACT_APP_OAUTH_GITHUB_AUTH_SERVER!;
  };
  const navigate = useNavigate();

  useEffect(() => {
    isLogin().then(isLogin => {
      if (isLogin) navigate("/lobby");
    });
  }, [navigate]);

  return (
    <Page>
      <div css={style.landingPageBodyStyle}>
        <div css={style.descriptionStyle}>
          <img css={style.jaPartyWordStyle} src={JaPartyWord} alt="JaPartyWord" />
          친구들과 얼굴을 마주하며 게임을 즐길 수 있습니다!
          <br />
          나의 표정을 읽히지 않고 상대의 표정을 읽어내 게임에서 승리하세요!
        </div>
        <div>
          <img css={style.landingImageStyle} src={LandingImage} alt="LandingImage" />
        </div>
        <div css={style.logoContainerStyle}>
          <img css={style.logoStyle} src={NaverLogo} alt="NaverLogo" />
          <img css={style.logoStyle} src={KakaoLogo} alt="KakaoLogo" />
          <img css={style.logoStyle} src={GoogleLogo} alt="GoogleLogo" />
          <img css={style.logoStyle} src={GithubLogo} alt="GithubLogo" onClick={handleGithubLogin} />
        </div>
      </div>
    </Page>
  );
};

export default LandingPage;

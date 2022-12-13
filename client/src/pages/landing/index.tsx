/** @jsxImportSource @emotion/react */
import React, { useEffect } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import LandingBackgroundImage from "../../assets/images/landing-background-image.png";
import PlayingExample from "../../assets/images/playing-example.png";
import WaitingExample from "../../assets/images/waiting-example.png";
import WhitePaint from "../../assets/images/white-paint.png";
import NaverLogo from "../../assets/logo/naver_logo.png";
import KakaoLogo from "../../assets/logo/kakao_logo.png";
import GoogleLogo from "../../assets/logo/google_logo.png";
import GithubLogo from "../../assets/logo/github_logo.png";
import { isLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = process.env.REACT_APP_OAUTH_GOOGLE_AUTH_SERVER!;
  };

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
        <div css={style.landingContentStyle}>
          <img css={style.landingImageStyle} src={LandingBackgroundImage} alt="LandingImage" />
          <img css={style.waitingExampleStyle} src={WaitingExample} alt="WaitingExample" />
          <img css={style.playingExampleStyle} src={PlayingExample} alt="PlayingExample" />
          <div css={style.descriptionWrapperStyle}>
            <div css={style.descriptionContentStyle}>
              <p>친구들과 얼굴을 마주하며 게임을 즐길 수 있습니다!</p>
              <p>나의 표정을 읽히지 않고 상대의 표정을 읽어내 게임에서 승리하세요!</p>
              <img css={style.whitePaintStyle} src={WhitePaint} alt="WhitePaint" />
            </div>
          </div>
        </div>
        <div css={style.singInWrapperStyle}>
          <p>Sign in with</p>
          <div css={style.logoContainerStyle}>
            {/* <img css={style.logoStyle} src={NaverLogo} alt="NaverLogo" /> */}
            {/* <img css={style.logoStyle} src={KakaoLogo} alt="KakaoLogo" /> */}
            <img css={style.logoStyle} src={GoogleLogo} alt="GoogleLogo" onClick={handleGoogleLogin} />
            <img css={style.logoStyle} src={GithubLogo} alt="GithubLogo" onClick={handleGithubLogin} />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default LandingPage;

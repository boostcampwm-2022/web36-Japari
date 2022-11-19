/** @jsxImportSource @emotion/react */
import React from "react";
import { landingPageBodyStyle } from "./style";
import { Page } from "../../stories/Page";

const LandingPage: React.FC = () => {
  return (
    <Page>
      <div css={landingPageBodyStyle}>
        <div>Ja! Party!</div>
        <p>친구들과 얼굴을 마주하며 게임을 즐길 수 있습니다!</p>
        <p>나의 표정을 읽히지 않고 상대의 표정을 읽어내 게임에서 승리하세요!</p>
        <div>image</div>
        <div>logos</div>
      </div>
    </Page>
  );
};

export default LandingPage;

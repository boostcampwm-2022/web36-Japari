/** @jsxImportSource @emotion/react */
import React from "react";
import { landingPageBodyStyle, jaPartyWordStyle, descriptionStyle, firstRowStyle } from "./style";
import { Page } from "../../stories/Page";

const LandingPage: React.FC = () => {
  return (
    <Page>
      <div css={landingPageBodyStyle}>
        <div css={descriptionStyle}>
          <img src="/logo/Ja-Party-word.png" css={jaPartyWordStyle} />
          친구들과 얼굴을 마주하며 게임을 즐길 수 있습니다!
          <br />
          나의 표정을 읽히지 않고 상대의 표정을 읽어내 게임에서 승리하세요!
        </div>
        <div>image</div>
        <div>소셜 로그인</div>
      </div>
    </Page>
  );
};

export default LandingPage;

/** @jsxImportSource @emotion/react */
import React from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import { camList } from "../dummy";
import Cam from "../../components/Cam";
import InGameCamList from "../../components/InGameCamList";

const PlayingPage: React.FC = () => {
  // user 정보 로직
  let camsLeft = camList.filter((cam, idx) => idx % 2 === 0);
  let camsRight = camList.filter((cam, idx) => idx % 2 === 1);
  return (
    <Page>
      <div css={style.PlayingContentContainer}>
        <InGameCamList camList={camsLeft} />
        <InGameCamList camList={camsRight} />
      </div>
    </Page>
  );
};

export default PlayingPage;

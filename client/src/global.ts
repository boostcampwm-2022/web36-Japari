import { css } from "@emotion/react";
import LINESeedKRBold from "./assets/fonts/LINESeedKR-Bold.ttf";
import LINESeedKRRegular from "./assets/fonts/LINESeedKR-Regular.ttf";
import LINESeedKRThin from "./assets/fonts/LINESeedKR-Thin.ttf";

export const globalStyle = css`
  @font-face {
    font-family: "LINESeedKR";
    src: url(${LINESeedKRBold}) format("truetype");
    font-weight: bold;
  }

  @font-face {
    font-family: "LINESeedKR";
    src: url(${LINESeedKRRegular}) format("truetype");
    font-style: "normal";
  }

  @font-face {
    font-family: "LINESeedKR";
    src: url(${LINESeedKRThin}) format("truetype");
    font-weight: 100;
  }

  /*
  기본 드래그 불가 설정
  .draggable 클래스 등록시 드래그 허용
   */
  * {
    font-family: "LINESeedKR";
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .draggable {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
`;

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

  * {
    font-family: "LINESeedKR";
    font-size: 16px;
  }

  body,
  p,
  div,
  button,
  span {
    margin: 0;
    padding: 0;
  }
`;

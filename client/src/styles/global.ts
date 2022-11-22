import { css } from "@emotion/react";
import LINESeedKRBold from "../assets/fonts/LINESeedKR-Bold.ttf";
import LINESeedKRRegular from "../assets/fonts/LINESeedKR-Regular.ttf";
import LINESeedKRThin from "../assets/fonts/LINESeedKR-Thin.ttf";

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

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* added */
  a,
  button,
  input,
  textarea {
    color: inherit;
    font-size: inherit;
  }
  a {
    text-decoration: none;
  }
  button {
    cursor: pointer;
    border: none;
    background: transparent;
  }
  ul,
  li {
    list-style: none;
  }
  strong,
  b {
    font-weight: normal;
  }

  * {
    font-family: "LINESeedKR";
    font-size: 16px;
  }
`;

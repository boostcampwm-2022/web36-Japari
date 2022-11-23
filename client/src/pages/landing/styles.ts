import { css } from "@emotion/react";

export const landingPageBodyStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 30px;
  box-sizing: border-box;
  font-weight: bold;
`;

export const jaPartyWordStyle = css`
  position: relative;
  top: 15px;

  width: 150px;
  height: 75px;
  transform: rotate(-11deg);
`;

export const descriptionStyle = css`
  text-align: right;
  line-height: 30px;
  > p {
    margin: 0px;
    position: relative;
  }
`;

export const firstRowStyle = css`
  display: flex;
  flex-direction: row;
`;

export const landingImageStyle = css`
  width: 100%;
`;

export const logoContainerStyle = css`
  display: flex;
  gap: 20px;
`;

export const logoStyle = css`
  height: 60px;
  width: 60px;
`;

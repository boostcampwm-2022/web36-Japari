import { css } from "@emotion/react";

export const landingPageBodyStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1rem 2rem 2rem 2rem;
  box-sizing: border-box;
  font-weight: bold;
`;

export const jaPartyWordStyle = css`
  position: relative;
  top: 1rem;

  width: 10rem;
  height: 5rem;
  transform: rotate(-11deg);
`;

export const descriptionStyle = css`
  text-align: right;
  line-height: 2rem;
  > p {
    margin: 0;
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
  gap: 1.25rem;
`;

export const logoStyle = css`
  height: 4rem;
  width: 4rem;
`;

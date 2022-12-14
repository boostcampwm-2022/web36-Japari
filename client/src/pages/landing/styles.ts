import { css } from "@emotion/react";

export const landingPageBodyStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0rem 2rem 0rem;
  font-weight: bold;
`;

export const jaPartyWordStyle = css`
  position: relative;
  top: 1rem;

  width: 10rem;
  height: 5rem;
  transform: rotate(-11deg);
`;

export const firstRowStyle = css`
  display: flex;
  flex-direction: row;
`;

export const landingContentStyle = css`
  position: relative;
  height: 35rem;
`;

export const landingContentBackgroundStyle = css`
  position: absolute;
  height: 35rem;
  width: max(100vw, 80rem);
  background: linear-gradient(to right, #97cce8, #87c2e2);
`;

export const landingImageStyle = css`
  height: 100%;
  opacity: 0.5;
`;

export const waitingExampleStyle = css`
  position: absolute;
  width: 50%;
  top: 3rem;
  left: 3rem;
  border-radius: 1rem;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.4);
`;

export const playingExampleStyle = css`
  position: absolute;
  width: 50%;
  top: 6rem;
  right: 3rem;
  border-radius: 1rem;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.4);
`;

export const descriptionWrapperStyle = css`
  text-align: left;
  line-height: 2rem;
  left: 1.5rem;
  bottom: 1.5rem;
  position: absolute;
  width: 50rem;
  height: 7.5rem;
`;

export const descriptionContentStyle = css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  height: 100%;
  padding: 1rem 0 0 2.5rem;
  > p {
    position: relative;
    font-size: 1.5rem;
    z-index: 10;
  }
`;

export const whitePaintStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const logoContainerStyle = css`
  display: flex;
  gap: 1.25rem;
`;

export const singInWrapperStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  > p {
    font-size: 1.2rem;
  }
`;

export const logoStyle = css`
  height: 4rem;
  width: 4rem;

  &:hover {
    cursor: pointer;
  }
`;

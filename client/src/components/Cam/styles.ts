import { css } from "@emotion/react";

export const camWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  background-color: black;
  border-radius: 10px;
  border: 1px solid red;
  overflow: hidden;

  width: 16rem;
  aspect-ratio: 4/3;

  > video {
    width: 100%;
    height: 100%;
    transform: rotateY(180deg); // 좌우 반전
  }
`;

export const profileStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  overflow: hidden;
  width: 50%;
  aspect-ratio: 1/1;
  border-radius: 50%;

  > img {
    max-width: 100%;
    max-height: 100%;
  }
`;

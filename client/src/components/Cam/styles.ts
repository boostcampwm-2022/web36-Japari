import { css } from "@emotion/react";

export const camContainerStyle = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;

  > span {
    font-size: 18px;
    font-weight: bold;

    &:nth-child(2) {
      margin-top: 0.5rem;
    }

    &:last-child {
      color: gray;
    }
  }
`;

export const camWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  background-color: black;
  border-radius: 10px;
  border: 1px solid green;
  overflow: hidden;

  width: 12rem;
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

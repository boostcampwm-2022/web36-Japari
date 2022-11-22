import { css } from "@emotion/react";

export const largeButtonStyle = css`
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }

  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 6rem;
  height: 2rem;

  padding-top: 3px; // 글자를 가운데로 정렬하는 용도
  font-weight: bold;
`;

export const smallButtonStyle = css`
  &:hover {
    opacity: 0.4;
    cursor: pointer;
  }

  border: 1px solid black;
  border-radius: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  width: 3.5rem;
  height: 1.5rem;

  padding-top: 3px; // 글자를 가운데로 정렬하는 용도
  font-weight: bold;
`;

export const gameStartButtonStyle = css`
  background: #ec7171;
  border: 1px solid #ffbaba;
`;

export const createRoomButtonStyle = css`
  background: #ec7171;
  border: 1px solid #ffbaba;
`;

export const exitRoomButtonStyle = css`
  background: #d6fc84;
  border: 1px solid #e1ffba;
`;

export const acceptButtonStyle = css`
  background: #f0efff; ;
`;

export const declineButtonStyle = css`
  background: #fde1e3;
`;

export const OKButtonStyle = css`
  background: #f0efff; ;
`;

export const closeButtonStyle = css`
  background: #fde1e3;
`;

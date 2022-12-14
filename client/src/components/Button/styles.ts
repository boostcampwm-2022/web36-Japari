import { css } from "@emotion/react";

export const largeButtonStyle = css`
  &:hover {
    opacity: 0.6;
    cursor: pointer;
    transition: all 0.3s;
  }

  border-radius: 0.6rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  width: 8rem;
  height: 2.5rem;

  font-weight: bold;
`;

export const smallButtonStyle = css`
  &:hover {
    opacity: 0.4;
    cursor: pointer;
    transition: all 0.3s;
  }

  border: 0.1rem solid black;
  border-radius: 0.3rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);

  width: 3.5rem;
  height: 1.5rem;

  font-weight: bold;
`;

export const gameStartButtonStyle = css`
  background: #ec7171;
  border: 0.1rem solid #ffbaba;
`;

export const createRoomButtonStyle = css`
  background: #ec7171;
  border: 0.1rem solid #ffbaba;
`;

export const exitRoomButtonStyle = css`
  background: #d6fc84;
  border: 0.1rem solid #e1ffba;
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

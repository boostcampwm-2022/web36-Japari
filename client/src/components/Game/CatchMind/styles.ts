import { css } from "@emotion/react";

export const gameWrapperStyle = css`
  display: flex;
  gap: 2rem;
`;

export const paletteStyle = css`
  width: 15rem;
  /* height: 40rem; */
  background-color: red;
`;

export const gameViewStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
`;

export const canvasStyle = css`
  border: 1px solid black;
  background-color: white;
  width: 100%;
  height: 32rem;
`;

export const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;

    > span {
      font-size: 1.5rem;
    }
  }
`;

export const timerStyle = css`
  img {
    width: 2rem;
    height: 2rem;
    background-color: transparent;
  }

  gap: 1rem;
`;

export const answerStyle = css`
  color: tomato;
  font-weight: bold;
`;

export const roundStyle = css``;

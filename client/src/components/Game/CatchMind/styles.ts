import { css } from "@emotion/react";

export const gameWrapperStyle = css`
  display: flex;
  gap: 1rem;
`;

export const paletteStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  width: 15rem;
  /* height: 40rem; */
  background-color: burlywood;
  border: 1px solid black;
  border-radius: 5px;

  box-sizing: content-box;
  padding: 0.5rem;
`;

export const trashCanStyle = css`
  width: 4rem;
  height: 4rem;
  border: 1px solid black;
  border-radius: 5px;
`;

export const toggleStyle = css`
  width: 4rem;
  height: 4rem;
  border: 1px solid black;
  border-radius: 5px;
`;

export const selectedColorStyle = (color: string) => css`
  width: 4rem;
  height: 4rem;
  border: 1px solid black;
  border-radius: 5px;

  background-color: ${color};
`;

export const colorGridStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
`;

export const colorStyle = (color: string) => css`
  width: 2rem;
  height: 2rem;
  border: 1px solid white;
  border-radius: 5px;

  background-color: ${color};
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

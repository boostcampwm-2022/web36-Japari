import { css } from "@emotion/react";

export const gameWrapperStyle = css`
  display: flex;
  gap: 1rem;
`;

export const paletteStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;

  width: 15rem;
  /* height: 40rem; */
  background-color: burlywood;
  border: 1px solid black;
  border-radius: 5px;

  box-sizing: content-box;
  padding: 0.5rem;
`;

export const buttonStyle = css`
  border: 1px solid black;
  border-radius: 5px;

  width: 4rem;
  padding: 3px 0;
  cursor: pointer;
  /* box-sizing: content-box; */
`;

export const clearStyle = css`
  width: 4rem;
  border: 1px solid black;
  border-radius: 5px;
  padding: 3px 0;
  cursor: pointer;
`;

export const toggleStyle = css`
  width: 4rem;
  height: 4rem;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;

  > img {
    width: 90%;
    height: 90%;
  }
`;

export const selectedColorStyle = (color: string) => css`
  width: 4rem;
  height: 4rem;
  border: 1px solid black;
  border-radius: 5px;

  background-color: ${color};
  cursor: pointer;
`;

export const colorGridStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  cursor: pointer;
`;

export const colorStyle = (color: string) => css`
  width: 2rem;
  height: 2rem;
  border: 1px solid white;
  border-radius: 5px;

  background-color: ${color};
  cursor: pointer;
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

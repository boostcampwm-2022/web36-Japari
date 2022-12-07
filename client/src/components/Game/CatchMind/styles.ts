import { css } from "@emotion/react";

export const gameWrapperStyle = css`
  display: flex;
  gap: 1rem;
`;

export const paletteStyle = css`
  position: relative;
  bottom: 6px;

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

export const toolStyle = css`
  display: flex;
  gap: 0.25rem;
  flex-direction: column;
`;

export const buttonStyle = (line: string, thisLine: string) => css`
  border-radius: 5px;
  ${line === thisLine ? "border: 3px solid green;" : ""}

  box-sizing: border-box;
  width: 4rem;
  height: 1.5rem;
  margin: 0.25rem;
  background-color: plum;
  cursor: pointer;
  line-height: 1.5rem;
  text-align: center;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
`;

export const clearStyle = css`
  width: 4rem;
  border-radius: 5px;
  padding: 3px 0;
  cursor: pointer;
  background-color: plum;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
`;

export const toggleStyle = (mode: string, thisMode: string) => css`
  position: relative;
  width: 4rem;
  height: 4rem;
  box-sizing: border-box;
  ${mode === thisMode ? "border: 3px solid green;" : ""}
  border-radius: 5px;
  cursor: pointer;
  background-color: plum;
  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 3rem;
  }
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
`;

export const lineWidthStyle = css``;

export const selectedColorStyle = (color: string) => css`
  width: 4rem;
  height: 4rem;
  border-radius: 5px;

  background-color: ${color};
  cursor: pointer;
`;

export const colorGridStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  row-gap: 0.25rem;
  column-gap: 0.25rem;
  cursor: pointer;
`;

export const colorStyle = (color: string) => css`
  width: 2rem;
  height: 2rem;
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

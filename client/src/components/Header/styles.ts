import { css } from "@emotion/react";

export const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0.5rem 2rem 0 1rem;
`;

export const headerLeftStyle = css`
  display: flex;
`;

export const audioControllerStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 15rem;
  height: 3rem;
  border: 1px solid green;
  margin-left: 2rem;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.7);

  > p {
    font-size: large;
    color: lightgreen;
    animation: marquee 5s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translate(-100%, 0);
    }
    100% {
      transform: translate(220%, 0);
    }
  }
`;

export const bgmButtonStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: content-box;
  width: 3rem;
  height: 3rem;
  background-color: yellowgreen;

  &:hover {
    cursor: pointer;
  }

  > img {
    height: 2.5rem;
  }
`;

export const headerRightStyle = css`
  display: flex;
`;

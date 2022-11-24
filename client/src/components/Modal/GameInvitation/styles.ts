import { css } from "@emotion/react";

export const modalContents = css`
  display: flex;
  justify-content: center;
  gap: 2rem;

  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    li {
      height: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
  }
`;

export const modalContentLeftStyle = css`
  font-weight: bold;
`;

export const modalContentRightStyle = css`
  width: 10rem;

  > li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const footerStyle = css`
  display: flex;
  justify-content: center;
  gap: 7rem;
`;

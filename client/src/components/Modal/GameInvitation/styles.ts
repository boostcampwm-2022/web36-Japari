import { css } from "@emotion/react";

export const modalContents = css`
  display: flex;
  justify-content: center;
  gap: 2rem;

  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:first-child {
      font-weight: bold;
    }

    &:nth-child(2) {
      width: 10rem;

      > li {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    li {
      height: 2rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
  }
`;

export const footerStyle = css`
  display: flex;
  justify-content: center;
  gap: 7rem;
`;

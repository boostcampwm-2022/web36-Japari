import { css } from "@emotion/react";

export const inputStyle = css`
  border-radius: 0.3rem;
  border: 0.08rem solid grey;
  padding: 0.1rem 0.25rem;

  :disabled {
    background-color: #dddddd;
  }
`;

export const smallInputStyle = css`
  width: 10rem;
`;

export const largeInputStyle = css`
  width: 15rem;
`;

export const chatInputStyle = css`
  width: 25rem;
`;

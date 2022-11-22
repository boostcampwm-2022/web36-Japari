import { css } from "@emotion/react";

export const TabContainerStyle = css`
  display: flex;
  flex-direction: row;
  list-style: none;
`;

export const SelectedTabStyle = css`
  width: 6rem;
  height: 4.5rem;
  border-radius: 0.75rem 0.75rem 0 0;
  > p {
    text-align: center;
    font-size: 1.3rem;
    font-weight: bold;
  }
`;

export const UnSelectedTabStyle = css`
  width: 4rem;
  height: 3rem;
  border-radius: 0.75rem 0.75rem 0 0;
  > p {
    text-align: center;
    font-size: 1.1rem;
    color: #9f9f9f;
  }
`;

export const TabStyle = [
  css`
    background-color: #ffaeae;
  `,
  css`
    background-color: #ffff6c;
  `,
  css`
    background-color: #6bed78;
  `,
];

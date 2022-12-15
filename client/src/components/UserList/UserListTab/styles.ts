import { css } from "@emotion/react";

export const TabContainerStyle = css`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-left: 0.75rem;

  > li {
    &:hover {
      cursor: pointer;
    }
  }
`;

export const TabStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SelectedTabStyle = css`
  width: 4.75rem;
  height: 3rem;
  border-radius: 0.75rem 0.75rem 0 0;
  > p {
    font-size: 1.3rem;
    font-weight: bold;
  }
`;

export const UnSelectedTabStyle = css`
  width: 4rem;
  height: 2.5rem;
  border-radius: 0.75rem 0.75rem 0 0;
  > p {
    font-size: 1.1rem;
    color: #9f9f9f;
  }
`;

export const TabBackgroundColorStyle = [
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

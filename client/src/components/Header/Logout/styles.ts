import { css } from "@emotion/react";

export const logoutTextStyle = css`
  font-weight: bold;
  margin-left: 0.5rem;
`;

export const logoutContainerStyle = css`
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #999;
    filter: invert(50%);
  }
`;

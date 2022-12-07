import { css } from "@emotion/react";

export const logoutTextStyle = css`
  font-weight: bold;
  margin-left: 0.5rem;
`;

export const micCamContainerStyle = css`
  display: flex;
  align-items: center;
  width: 8rem;
`;

export const micCamButtonStyle = css`
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    filter: invert(50%);
  }
`;

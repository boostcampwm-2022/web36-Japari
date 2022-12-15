import { css, Theme } from "@emotion/react";

export const ChattingContainerStyle = (theme: Theme) => css`
  background-color: ${theme.colors.secondary};
  width: 72.5rem;
  height: 12.5rem;
  border-radius: 0.75rem;
  padding: 0.75rem;
  box-sizing: border-box;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ChattingHRStyle = css`
  border: solid 0.1rem #afaaff;
  width: 100%;
`;
